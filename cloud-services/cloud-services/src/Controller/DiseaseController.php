<?php

namespace App\Controller;

use App\Entity\Disease;
use App\Repository\DiseaseRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/diseases')]
class DiseaseController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private DiseaseRepository $diseaseRepository
    ) {}

    #[Route('', name: 'disease_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        return $this->json($this->diseaseRepository->findAll());
    }

    #[Route('', name: 'disease_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $disease = new Disease();
        $disease->setName($data['name'] ?? '');
        $disease->setCategory($data['category'] ?? '');
        $disease->setDescription($data['description'] ?? '');

        $this->em->persist($disease);
        $this->em->flush();

        return $this->json($disease, Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'disease_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $disease = $this->diseaseRepository->find($id);

        if (!$disease) {
            return $this->json(['error' => 'Disease not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($disease);
    }

    #[Route('/{id}', name: 'disease_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $disease = $this->diseaseRepository->find($id);

        if (!$disease) {
            return $this->json(['error' => 'Disease not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) $disease->setName($data['name']);
        if (isset($data['category'])) $disease->setCategory($data['category']);
        if (isset($data['description'])) $disease->setDescription($data['description']);

        $this->em->flush();

        return $this->json($disease);
    }

    #[Route('/{id}', name: 'disease_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $disease = $this->diseaseRepository->find($id);

        if (!$disease) {
            return $this->json(['error' => 'Disease not found'], Response::HTTP_NOT_FOUND);
        }

        $this->em->remove($disease);
        $this->em->flush();

        return $this->json(['message' => 'Disease deleted']);
    }
}
