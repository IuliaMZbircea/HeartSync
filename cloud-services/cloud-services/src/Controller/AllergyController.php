<?php

namespace App\Controller;

use App\Entity\Allergy;
use App\Repository\AllergyRepository;
use App\Entity\Patient;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/allergies')]
class AllergyController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private AllergyRepository $allergyRepository
    ) {}

    #[Route('', name: 'allergy_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $allergies = $this->allergyRepository->findAll();
        return $this->json($allergies);
    }

    #[Route('', name: 'allergy_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['patient_id'])) {
            return $this->json(['error' => 'Invalid or missing patient_id'], Response::HTTP_BAD_REQUEST);
        }

        $patient = $this->em->getRepository(Patient::class)->find($data['patient_id']);
        if (!$patient) {
            return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
        }

        $allergy = new Allergy();
        $allergy->setReaction($data['reaction'] ?? null);
        $allergy->setSeverity($data['severity'] ?? null);
        $allergy->setStatus($data['status'] ?? null);
        $allergy->setCreatedAt(new \DateTime());

        $this->em->persist($allergy);
        $this->em->flush();

        return $this->json($allergy, Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'allergy_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $allergy = $this->allergyRepository->find($id);

        if (!$allergy) {
            return $this->json(['error' => 'Allergy not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($allergy);
    }

    #[Route('/{id}', name: 'allergy_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $allergy = $this->allergyRepository->find($id);

        if (!$allergy) {
            return $this->json(['error' => 'Allergy not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['patient_id'])) {
            $patient = $this->em->getRepository(Patient::class)->find($data['patient_id']);
            if (!$patient) {
                return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
            }
            $allergy->setPatient($patient);
        }

        $allergy->setAllergen($data['allergen'] ?? $allergy->getAllergen());
        $allergy->setReaction($data['reaction'] ?? $allergy->getReaction());
        $allergy->setSeverity($data['severity'] ?? $allergy->getSeverity());
        $allergy->setStatus($data['status'] ?? $allergy->getStatus());

        $this->em->flush();

        return $this->json($allergy);
    }

    #[Route('/{id}', name: 'allergy_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $allergy = $this->allergyRepository->find($id);

        if (!$allergy) {
            return $this->json(['error' => 'Allergy not found'], Response::HTTP_NOT_FOUND);
        }

        $this->em->remove($allergy);
        $this->em->flush();

        return $this->json(['message' => 'Allergy deleted successfully']);
    }
}
