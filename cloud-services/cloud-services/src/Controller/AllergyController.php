<?php

namespace App\Controller;

use App\Entity\Allergy;
use App\Entity\Patient;
use App\Repository\AllergyRepository;
use App\Repository\PatientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/custom-allergies')]
class AllergyController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private AllergyRepository $allergyRepository,
        private PatientRepository $patientRepository
    ) {}

    #[Route('', name: 'allergy_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $allergies = $this->allergyRepository->findAll();
        $response = array_map(function (Allergy $allergy) {
            return [
                'id' => $allergy->getId(),
                'name' => $allergy->getName(),
                'sevSerity' => $allergy->getSeverity(),
                'reaction' => $allergy->getReaction(),
                'notes' => $allergy->getNotes(),
                'recordedDate' => $allergy->getRecordedDate()?->format('Y-m-d'),
                'createdAt' => $allergy->getCreatedAt()?->format('Y-m-d H:i:s'),
                'patient' => $allergy->getPatient()?->getId(),
                'isActive' => $allergy->isIsActive(),
            ];
        }, $allergies);

        return $this->json($response);
    }

    #[Route('', name: 'allergy_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {

        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['patient_id'])) {
            return $this->json(['error' => 'Missing patient_id or invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $patient = $this->patientRepository->find($data['patient_id']);

        if (!$patient) {
            return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
        }

        $patient = $this->patientRepository->find($data['patient_id'] ?? null);
        if (!$patient) {
            return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
        }

        $allergy = new Allergy();
        $allergy->setPatient($patient);
        $allergy->setName($data['name'] ?? null);
        $allergy->setSeverity($data['severity'] ?? null);
        $allergy->setReaction($data['reaction'] ?? null);
        $allergy->setNotes($data['notes'] ?? null);

        if (isset($data['recordedDate'])) {
            $allergy->setRecordedDate(new \DateTime($data['recordedDate']));
        }

        $allergy->setCreatedAt(new \DateTime());
        $allergy->setIsActive(true);

        $this->em->persist($allergy);
        $this->em->flush();

        return $this->json([
            'allergy' => $allergy,
            'hl7' => [
                'resourceType' => 'AllergyIntolerance',
                'id' => $allergy->getId(),
                'subject' => [
                    'reference' => 'Patient/' . $allergy->getPatient()?->getId(),
                ],
                'code' => ['text' => $allergy->getName()],
                'recordedDate' => $allergy->getRecordedDate()?->format('Y-m-d'),
                'reaction' => [[
                    'description' => $allergy->getReaction(),
                    'severity' => $allergy->getSeverity(),
                    'note' => [['text' => $allergy->getNotes()]]
                ]]
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'allergy_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $allergy = $this->allergyRepository->find($id);

        if (!$allergy) {
            return $this->json(['error' => 'Allergy not found'], Response::HTTP_NOT_FOUND);
        }

        $patientId = $allergy->getPatient()?->getId();

        return $this->json([
            'id' => $allergy->getId(),
            'name' => $allergy->getName(),
            'severity' => $allergy->getSeverity(),
            'reaction' => $allergy->getReaction(),
            'notes' => $allergy->getNotes(),
            'recordedDate' => $allergy->getRecordedDate()?->format('Y-m-d'),
            'createdAt' => $allergy->getCreatedAt()?->format('Y-m-d H:i:s'),
            'patient' => $allergy->getPatient()?->getId(),
            'isActive' => $allergy->isIsActive(),
        ]);
    }

    #[Route('/{id}', name: 'allergy_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $allergy = $this->allergyRepository->find($id);

        if (!$allergy || !$allergy->isIsActive()) {
            return $this->json(['error' => 'Allergy not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['name'])) {
            $allergy->setName($data['name']);
        }

        if (isset($data['severity'])) {
            $allergy->setSeverity($data['severity']);
        }

        if (isset($data['reaction'])) {
            $allergy->setReaction($data['reaction']);
        }

        if (isset($data['notes'])) {
            $allergy->setNotes($data['notes']);
        }

        if (isset($data['recordedDate'])) {
            $allergy->setRecordedDate(new \DateTime($data['recordedDate']));
        }

$allergy->setName($data['name']             ?? $allergy->getName());
    $allergy->setSeverity($data['severity']     ?? $allergy->getSeverity());
    $allergy->setReaction($data['reaction']     ?? $allergy->getReaction());
    $allergy->setNotes($data['notes']           ?? $allergy->getNotes());

    if (\array_key_exists('isActive', $data)) {
        $allergy->setIsActive((bool) $data['isActive']);
    }

    if (!empty($data['recordedDate'])) {
        $allergy->setRecordedDate(new \DateTimeImmutable($data['recordedDate']));
    }

    $this->em->flush();
        return $this->json(['message' => 'Allergy updated successfully']);
    }

    #[Route('/{id}', name: 'allergy_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $allergy = $this->allergyRepository->find($id);

        if (!$allergy || !$allergy->isIsActive()) {
            return $this->json(['error' => 'Allergy not found'], Response::HTTP_NOT_FOUND);
        }

        $allergy->setIsActive(false);
        $this->em->flush();

        return $this->json(['message' => 'Allergy deactivated']);
    }

#[Route('/patient/{patientId}', name: 'allergy_by_patient', methods: ['GET'])]
public function getAllergiesByPatient(int $patientId): JsonResponse
{
    $patient = $this->patientRepository->find($patientId);

    if (!$patient) {
        return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
    }

    $allergies = $this->allergyRepository->findBy([
        'patient' => $patient    ]);

    $response = array_map(function (Allergy $allergy) {
        return [
            'id' => $allergy->getId(),
            'name' => $allergy->getName(),
            'severity' => $allergy->getSeverity(),
            'reaction' => $allergy->getReaction(),
            'notes' => $allergy->getNotes(),
            'recordedDate' => $allergy->getRecordedDate()?->format('Y-m-d'),
            'createdAt' => $allergy->getCreatedAt()?->format('Y-m-d H:i:s'),
            'isActive' => $allergy->isIsActive(),
        ];
    }, $allergies);

    return $this->json($response);
}


}