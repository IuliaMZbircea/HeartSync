<?php

namespace App\Controller;

use App\Entity\Referral;
use App\Entity\Patient;
use App\Entity\Doctor;
use App\Repository\ReferralRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/referrals')]
class ReferralController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private ReferralRepository $referralRepository
    ) {}

    #[Route('', name: 'referral_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $referrals = $this->referralRepository->findBy(['isActive' => true]);

        $fhirBundle = [
            'resourceType' => 'Bundle',
            'type' => 'collection',
            'entry' => array_map(fn($r) => ['resource' => $this->toFhir($r)], $referrals)
        ];

        return $this->json($fhirBundle);
    }

    #[Route('', name: 'referral_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $patient = $this->em->getRepository(Patient::class)->find($data['patient_id'] ?? null);
        $fromDoctor = $this->em->getRepository(Doctor::class)->find($data['from_doctor_id'] ?? null);
        $toDoctor = isset($data['to_doctor_id']) ? $this->em->getRepository(Doctor::class)->find($data['to_doctor_id']) : null;

        if (!$patient || !$fromDoctor) {
            return $this->json(['error' => 'Invalid patient_id or from_doctor_id'], Response::HTTP_BAD_REQUEST);
        }

        $referral = new Referral();
        $referral->setType($data['type']);
        $referral->setPatient($patient);
        $referral->setFromDoctor($fromDoctor);
        $referral->setToDoctor($toDoctor);
        $referral->setReason($data['reason']);
        $referral->setDate(new \DateTime($data['date']));
        $referral->setHl7Payload($data['hl7_payload'] ?? null);
        $referral->setFhirResponseId($data['fhir_response_id'] ?? null);
        $referral->setIsResolved($data['is_resolved'] ?? false);
        $referral->setIsActive(true);
        $referral->setCreatedAt(new \DateTime());

        $this->em->persist($referral);
        $this->em->flush();

        return $this->json($this->toFhir($referral), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'referral_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $referral = $this->referralRepository->find($id);
        if (!$referral || !$referral->isActive()) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->toFhir($referral));
    }

    #[Route('/{id}', name: 'referral_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $referral = $this->referralRepository->find($id);
        if (!$referral || !$referral->isActive()) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['type'])) $referral->setType($data['type']);
        if (isset($data['patient_id'])) {
            $patient = $this->em->getRepository(Patient::class)->find($data['patient_id']);
            if ($patient) $referral->setPatient($patient);
        }
        if (isset($data['from_doctor_id'])) {
            $fromDoctor = $this->em->getRepository(Doctor::class)->find($data['from_doctor_id']);
            if ($fromDoctor) $referral->setFromDoctor($fromDoctor);
        }
        if (array_key_exists('to_doctor_id', $data)) {
            $toDoctor = $this->em->getRepository(Doctor::class)->find($data['to_doctor_id']);
            $referral->setToDoctor($toDoctor);
        }
        if (isset($data['reason'])) $referral->setReason($data['reason']);
        if (isset($data['date'])) $referral->setDate(new \DateTime($data['date']));
        if (array_key_exists('hl7_payload', $data)) $referral->setHl7Payload($data['hl7_payload']);
        if (isset($data['fhir_response_id'])) $referral->setFhirResponseId($data['fhir_response_id']);
        if (isset($data['is_resolved'])) $referral->setIsResolved($data['is_resolved']);

        $this->em->flush();
        return $this->json($this->toFhir($referral));
    }

    #[Route('/{id}', name: 'referral_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $referral = $this->referralRepository->find($id);
        if (!$referral || !$referral->isActive()) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $referral->setIsActive(false);
        $this->em->flush();

        return $this->json(['message' => 'Referral marked as inactive']);
    }

    private function toFhir(Referral $ref): array
    {
        return [
            'resourceType' => 'ServiceRequest',
            'id' => $ref->getId(),
            'status' => $ref->isActive() ? 'active' : 'inactive',
            'intent' => 'order',
            'code' => ['text' => $ref->getType()],
            'subject' => ['reference' => 'Patient/' . $ref->getPatient()->getId()],
            'requester' => ['reference' => 'Practitioner/' . $ref->getFromDoctor()->getId()],
            'recipient' => $ref->getToDoctor() ? [['reference' => 'Practitioner/' . $ref->getToDoctor()->getId()]] : [],
            'authoredOn' => $ref->getDate()?->format('Y-m-d'),
            'note' => [['text' => $ref->getReason()]],
            'extension' => $ref->getHl7Payload() ? [[
                'url' => 'http://example.com/fhir/StructureDefinition/hl7Payload',
                'valueString' => $ref->getHl7Payload()
            ]] : []
        ];
    }
}
