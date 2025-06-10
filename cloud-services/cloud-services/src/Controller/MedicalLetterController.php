<?php

namespace App\Controller;

use App\Entity\MedicalLetter;
use App\Repository\MedicalLetterRepository;
use App\Repository\ReferralRepository;
use App\Repository\PatientRepository;
use App\Repository\DoctorRepository;
use App\Repository\ConsultationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/custom-medical-letters')]
class MedicalLetterController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private MedicalLetterRepository $medicalLetterRepository,
        private ReferralRepository $referralRepository,
        private PatientRepository $patientRepository,
        private DoctorRepository $doctorRepository,
        private ConsultationRepository $consultationRepository
    ) {}

    #[Route('', name: 'medical_letter_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $letters = $this->medicalLetterRepository->findAll();

        $hl7 = array_map(function ($letter) {
            return $this->formatHL7($letter);
        }, $letters);

        return $this->json($hl7);
    }

    #[Route('', name: 'medical_letter_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);

        $referral = $this->referralRepository->find($this->extractId($data['referral']));
        $patient = $this->patientRepository->find($this->extractId($data['patient']));
        $fromSpecialist = $this->doctorRepository->find($this->extractId($data['fromSpecialist']));
        $toDoctor = $this->doctorRepository->find($this->extractId($data['toDoctor']));
        $consultation = isset($data['consultation']) ? $this->consultationRepository->find($this->extractId($data['consultation'])) : null;

        if (!$referral || !$patient || !$fromSpecialist || !$toDoctor) {
            return $this->json(['error' => 'Invalid relation IDs'], Response::HTTP_BAD_REQUEST);
        }

        $medicalLetter = new MedicalLetter();
        $medicalLetter->setReferral($referral);
        $medicalLetter->setPatient($patient);
        $medicalLetter->setFromSpecialist($fromSpecialist);
        $medicalLetter->setToDoctor($toDoctor);
        $medicalLetter->setConsultation($consultation);
        $medicalLetter->setDate(new \DateTime($data['date']));
        $medicalLetter->setFhirPayload($data['fhirPayload']);
        $medicalLetter->setIsActive(true);
        $medicalLetter->setCreatedAt(new \DateTime());

        $this->em->persist($medicalLetter);
        $this->em->flush();

        return $this->json($this->formatHL7($medicalLetter), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'medical_letter_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $medicalLetter = $this->medicalLetterRepository->find($id);
        if (!$medicalLetter || !$medicalLetter->isActive()) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->formatHL7($medicalLetter));
    }

    #[Route('/{id}', name: 'medical_letter_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $medicalLetter = $this->medicalLetterRepository->find($id);
        if (!$medicalLetter || !$medicalLetter->isActive()) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['referral'])) {
            $referral = $this->referralRepository->find($this->extractId($data['referral']));
            if ($referral) $medicalLetter->setReferral($referral);
        }
        if (isset($data['patient'])) {
            $patient = $this->patientRepository->find($this->extractId($data['patient']));
            if ($patient) $medicalLetter->setPatient($patient);
        }
        if (isset($data['fromSpecialist'])) {
            $fromSpecialist = $this->doctorRepository->find($this->extractId($data['fromSpecialist']));
            if ($fromSpecialist) $medicalLetter->setFromSpecialist($fromSpecialist);
        }
        if (isset($data['toDoctor'])) {
            $toDoctor = $this->doctorRepository->find($this->extractId($data['toDoctor']));
            if ($toDoctor) $medicalLetter->setToDoctor($toDoctor);
        }
        if (isset($data['consultation'])) {
            $consultation = $this->consultationRepository->find($this->extractId($data['consultation']));
            $medicalLetter->setConsultation($consultation);
        }
        if (isset($data['date'])) $medicalLetter->setDate(new \DateTime($data['date']));
        if (isset($data['fhirPayload'])) $medicalLetter->setFhirPayload($data['fhirPayload']);

        $this->em->flush();

        return $this->json($this->formatHL7($medicalLetter));
    }

    #[Route('/{id}', name: 'medical_letter_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $medicalLetter = $this->medicalLetterRepository->find($id);
        if (!$medicalLetter) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $medicalLetter->setIsActive(false);
        $this->em->flush();

        return $this->json(['message' => 'Soft deleted']);
    }

    private function extractId(string $iriOrId): int
    {
        return str_contains($iriOrId, '/') ? (int)substr($iriOrId, strrpos($iriOrId, '/') + 1) : (int)$iriOrId;
    }

    private function formatHL7(MedicalLetter $ml): array
    {
        return [
            'resourceType' => 'DocumentReference',
            'id' => $ml->getId(),
            'status' => $ml->isActive() ? 'current' : 'inactive',
            'subject' => [
                'reference' => '/api/patients/' . $ml->getPatient()->getId(),
            ],
            'date' => $ml->getDate()?->format('Y-m-d'),
            'author' => [
                ['reference' => '/api/doctors/' . $ml->getFromSpecialist()->getId()]
            ],
            'custodian' => [
                'reference' => '/api/doctors/' . $ml->getToDoctor()->getId()
            ],
            'content' => [
                ['attachment' => ['data' => base64_encode($ml->getFhirPayload())]]
            ]
        ];
    }
}