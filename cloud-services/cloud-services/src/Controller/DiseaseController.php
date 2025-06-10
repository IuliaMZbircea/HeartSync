<?php

namespace App\Controller;

use App\Entity\Disease;
use App\Repository\DiseaseRepository;
use App\Repository\PatientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/custom-diseases')]
class DiseaseController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private DiseaseRepository $diseaseRepository,
        private PatientRepository $patientRepository
    ) {}

    #[Route('', name: 'disease_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $diseases = $this->diseaseRepository->findAll();

        $response = array_map(fn(Disease $disease) => $this->serializeDisease($disease), $diseases);

        return $this->json($response);
    }

    #[Route('', name: 'disease_create', methods: ['POST'])]
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

        $disease = new Disease();
        $disease->setName($data['name'] ?? '');
        $disease->setType($data['type'] ?? null);
        $disease->setDescription($data['description'] ?? null);
        $disease->setIsActive(true);
        $disease->setPatient($patient);

        $this->em->persist($disease);
        $this->em->flush();

        return $this->json($this->serializeDisease($disease), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'disease_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $disease = $this->diseaseRepository->find($id);

        if (!$disease || !$disease->isActive()) {
            return $this->json(['error' => 'Disease not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->serializeDisease($disease));
    }

    #[Route('/{id}', name: 'disease_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $disease = $this->diseaseRepository->find($id);

        if (!$disease) {
            return $this->json(['error' => 'Disease not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $disease->setName($data['name'] ?? $disease->getName());
        $disease->setType($data['type'] ?? $disease->getType());
        $disease->setDescription($data['description'] ?? $disease->getDescription());
        if (isset($data['isActive'])) {
            $disease->setIsActive((bool)$data['isActive']);
        }

        if (isset($data['patient_id'])) {
            $patient = $this->patientRepository->find($data['patient_id']);
            if ($patient) {
                $disease->setPatient($patient);
            }
        }

        $this->em->flush();

        return $this->json($this->serializeDisease($disease));
    }

    #[Route('/{id}', name: 'disease_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $disease = $this->diseaseRepository->find($id);

        if (!$disease) {
            return $this->json(['error' => 'Disease not found'], Response::HTTP_NOT_FOUND);
        }

        $disease->setIsActive(false);
        $this->em->flush();

        return $this->json(['message' => 'Disease marked as inactive']);
    }

    private function serializeDisease(Disease $disease): array
    {
        return [
            'id' => $disease->getId(),
            'name' => $disease->getName(),
            'type' => $disease->getType(),
            'description' => $disease->getDescription(),
            'isActive' => $disease->isActive(),
            'patientId' => $disease->getPatient()?->getId(),
            'hl7' => [
                'resourceType' => 'Condition',
                'id' => $disease->getId(),
                'subject' => ['reference' => 'Patient/' . $disease->getPatient()?->getId()],
                'code' => ['text' => $disease->getName()],
                'category' => [['text' => $disease->getType()]],
                'note' => [['text' => $disease->getDescription()]]
            ]
        ];
    }
}