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
        return $this->json($this->recommendationRepository->findAll());
    }

    #[Route('', name: 'recommendation_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $recommendation = new Recommendation();
        $recommendation->setActivityType($data['activityType'] ?? '');
        $recommendation->setDailyDuration((int)($data['dailyDuration'] ?? 0));
        $recommendation->setStartDate(new \DateTime($data['startDate'] ?? 'now'));

        if (!empty($data['endDate'])) {
            $recommendation->setEndDate(new \DateTime($data['endDate']));
        }

        $recommendation->setAdditionalNotes($data['additionalNotes'] ?? null);
        $recommendation->setStatus($data['status'] ?? 'active');
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

        if (isset($data['activityType'])) {
            $recommendation->setActivityType($data['activityType']);
        }
        if (isset($data['dailyDuration'])) {
            $recommendation->setDailyDuration((int)$data['dailyDuration']);
        }
        if (isset($data['startDate'])) {
            $recommendation->setStartDate(new \DateTime($data['startDate']));
        }
        if (isset($data['endDate'])) {
            $recommendation->setEndDate(new \DateTime($data['endDate']));
        }
        if (array_key_exists('additionalNotes', $data)) {
            $recommendation->setAdditionalNotes($data['additionalNotes']);
        }
        if (isset($data['status'])) {
            $recommendation->setStatus($data['status']);
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
