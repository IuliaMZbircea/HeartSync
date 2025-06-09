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
        $allergies = $this->allergyRepository->findBy(['status' => true]);

        $response = array_map(function (Allergy $allergy) {
            return [
                'id' => $allergy->getId(),
                'name' => $allergy->getName(),
                'reaction' => $allergy->getReaction(),
                'severity' => $allergy->getSeverity(),
                'notes' => $allergy->getNotes(),
                'recordedDate' => $allergy->getRecordedDate()?->format('Y-m-d'),
                'status' => $allergy->getStatus(),
                'hl7' => [
                    'resourceType' => 'AllergyIntolerance',
                    'id' => $allergy->getId(),
                    'code' => ['text' => $allergy->getName()],
                    'recordedDate' => $allergy->getRecordedDate()?->format('Y-m-d'),
                    'reaction' => [[
                        'description' => $allergy->getReaction(),
                        'severity' => $allergy->getSeverity(),
                        'note' => [['text' => $allergy->getNotes()]]
                    ]]
                ]
            ];
        }, $allergies);

        return $this->json($response);
    }

    #[Route('', name: 'allergy_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $allergy = new Allergy();
        $allergy->setName($data['name'] ?? null);
        $allergy->setReaction($data['reaction'] ?? null);
        $allergy->setSeverity($data['severity'] ?? null);
        $allergy->setNotes($data['notes'] ?? null);
        $allergy->setRecordedDate(isset($data['recordedDate']) ? new \DateTime($data['recordedDate']) : null);
        $allergy->setStatus(true);
        $allergy->setCreatedAt(new \DateTime());

        $this->em->persist($allergy);
        $this->em->flush();

        return $this->json([
            'allergy' => $allergy,
            'hl7' => [
                'resourceType' => 'AllergyIntolerance',
                'id' => $allergy->getId(),
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
        if (!$allergy || !$allergy->getStatus()) {
            return $this->json(['error' => 'Allergy not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'allergy' => $allergy,
            'hl7' => [
                'resourceType' => 'AllergyIntolerance',
                'id' => $allergy->getId(),
                'code' => ['text' => $allergy->getName()],
                'recordedDate' => $allergy->getRecordedDate()?->format('Y-m-d'),
                'reaction' => [[
                    'description' => $allergy->getReaction(),
                    'severity' => $allergy->getSeverity(),
                    'note' => [['text' => $allergy->getNotes()]]
                ]]
            ]
        ]);
    }

    #[Route('/{id}', name: 'allergy_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $allergy = $this->allergyRepository->find($id);
        if (!$allergy) {
            return $this->json(['error' => 'Allergy not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) $allergy->setName($data['name']);
        if (isset($data['reaction'])) $allergy->setReaction($data['reaction']);
        if (isset($data['severity'])) $allergy->setSeverity($data['severity']);
        if (isset($data['notes'])) $allergy->setNotes($data['notes']);
        if (isset($data['recordedDate'])) $allergy->setRecordedDate(new \DateTime($data['recordedDate']));
        if (isset($data['status'])) $allergy->setStatus((bool)$data['status']);

        $this->em->flush();

        return $this->json([
            'allergy' => $allergy,
            'hl7' => [
                'resourceType' => 'AllergyIntolerance',
                'id' => $allergy->getId(),
                'code' => ['text' => $allergy->getName()],
                'recordedDate' => $allergy->getRecordedDate()?->format('Y-m-d'),
                'reaction' => [[
                    'description' => $allergy->getReaction(),
                    'severity' => $allergy->getSeverity(),
                    'note' => [['text' => $allergy->getNotes()]]
                ]]
            ]
        ]);
    }

    #[Route('/{id}', name: 'allergy_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $allergy = $this->allergyRepository->find($id);
        if (!$allergy) {
            return $this->json(['error' => 'Allergy not found'], Response::HTTP_NOT_FOUND);
        }

        $allergy->setStatus(false);
        $this->em->flush();

        return $this->json(['message' => 'Allergy marked as inactive']);
    }
}
