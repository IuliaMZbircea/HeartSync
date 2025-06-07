<?php

namespace App\Controller;

use App\Entity\Allergy;
use App\Repository\AllergyRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\Constraints as Assert;

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
        return $this->json($this->allergyRepository->findAll());
    }

    #[Route('', name: 'allergy_create', methods: ['POST'])]
    public function create(Request $request, ValidatorInterface $validator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        // Validare severitate dacă e prezentă
        if (isset($data['severity'])) {
            $errors = $validator->validate($data['severity'], [
                new Assert\Choice(['choices' => ['low', 'medium', 'high'], 'message' => 'Severity must be low, medium or high'])
            ]);
            if (count($errors) > 0) {
                return $this->json(['error' => $errors[0]->getMessage()], Response::HTTP_BAD_REQUEST);
            }
        }

        $allergy = new Allergy();
        $allergy->setName($data['name'] ?? '');
        $allergy->setSeverity($data['severity'] ?? null);
        $allergy->setReaction($data['reaction'] ?? null);
        $allergy->setNotes($data['notes'] ?? null);

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
    public function update(Request $request, int $id, ValidatorInterface $validator): JsonResponse
    {
        $allergy = $this->allergyRepository->find($id);

        if (!$allergy) {
            return $this->json(['error' => 'Allergy not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['severity'])) {
            $errors = $validator->validate($data['severity'], [
                new Assert\Choice(['choices' => ['low', 'medium', 'high'], 'message' => 'Severity must be low, medium or high'])
            ]);
            if (count($errors) > 0) {
                return $this->json(['error' => $errors[0]->getMessage()], Response::HTTP_BAD_REQUEST);
            }
            $allergy->setSeverity($data['severity']);
        }

        if (isset($data['name'])) $allergy->setName($data['name']);
        if (isset($data['reaction'])) $allergy->setReaction($data['reaction']);
        if (array_key_exists('notes', $data)) $allergy->setNotes($data['notes']);

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

        return $this->json(['message' => 'Allergy deleted']);
    }
}
