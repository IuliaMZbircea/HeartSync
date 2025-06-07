<?php

namespace App\Controller;

use App\Entity\Recommendation;
use App\Repository\RecommendationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/recommendations')]
class RecommendationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private RecommendationRepository $recommendationRepository
    ) {}

    #[Route('', name: 'recommendation_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $recommendations = $this->recommendationRepository->findAll();
        return $this->json($recommendations);
    }

    #[Route('', name: 'recommendation_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $recommendation = new Recommendation();
        $recommendation->setActivityType($data['activity_type'] ?? '');
        $recommendation->setDailyDuration((int)($data['daily_duration'] ?? 0));
        $recommendation->setStartDate(new \DateTime($data['start_date'] ?? 'now'));

        if (!empty($data['end_date'])) {
            $recommendation->setEndDate(new \DateTime($data['end_date']));
        }

        $recommendation->setAdditionalNotes($data['additional_notes'] ?? null);
        $recommendation->setCreatedAt(new \DateTime());

        $this->em->persist($recommendation);
        $this->em->flush();

        return $this->json($recommendation, Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'recommendation_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $recommendation = $this->recommendationRepository->find($id);

        if (!$recommendation) {
            return $this->json(['error' => 'Recommendation not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($recommendation);
    }

    #[Route('/{id}', name: 'recommendation_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $recommendation = $this->recommendationRepository->find($id);

        if (!$recommendation) {
            return $this->json(['error' => 'Recommendation not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['activity_type'])) {
            $recommendation->setActivityType($data['activity_type']);
        }
        if (isset($data['daily_duration'])) {
            $recommendation->setDailyDuration((int)$data['daily_duration']);
        }
        if (isset($data['start_date'])) {
            $recommendation->setStartDate(new \DateTime($data['start_date']));
        }
        if (isset($data['end_date'])) {
            $recommendation->setEndDate(new \DateTime($data['end_date']));
        }
        if (array_key_exists('additional_notes', $data)) {
            $recommendation->setAdditionalNotes($data['additional_notes']);
        }

        $this->em->flush();

        return $this->json($recommendation);
    }

    #[Route('/{id}', name: 'recommendation_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $recommendation = $this->recommendationRepository->find($id);

        if (!$recommendation) {
            return $this->json(['error' => 'Recommendation not found'], Response::HTTP_NOT_FOUND);
        }

        $this->em->remove($recommendation);
        $this->em->flush();

        return $this->json(['message' => 'Recommendation deleted']);
    }
}
