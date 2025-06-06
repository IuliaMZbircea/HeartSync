<?php

namespace App\Controller;

use App\Entity\Medication;
use App\Repository\MedicationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/medications')]
class MedicationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private MedicationRepository $medicationRepository
    ) {}

    #[Route('', name: 'medication_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        return $this->json($this->medicationRepository->findAll());
    }

    #[Route('', name: 'medication_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $medication = new Medication();
        $medication->setName($data['name'] ?? '');
        $medication->setDose($data['dose'] ?? '');
        $medication->setFrequency($data['frequency'] ?? '');
        $medication->setRoute($data['route'] ?? '');
        $medication->setStartDate(new \DateTime($data['startDate'] ?? 'now'));

        if (!empty($data['endDate'])) {
            $medication->setEndDate(new \DateTime($data['endDate']));
        }

        $medication->setPrescribedBy($data['prescribedBy'] ?? '');
        $medication->setNotes($data['notes'] ?? null);

        $this->em->persist($medication);
        $this->em->flush();

        return $this->json($medication, Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'medication_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $medication = $this->medicationRepository->find($id);

        if (!$medication) {
            return $this->json(['error' => 'Medication not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($medication);
    }

    #[Route('/{id}', name: 'medication_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $medication = $this->medicationRepository->find($id);

        if (!$medication) {
            return $this->json(['error' => 'Medication not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) $medication->setName($data['name']);
        if (isset($data['dose'])) $medication->setDose($data['dose']);
        if (isset($data['frequency'])) $medication->setFrequency($data['frequency']);
        if (isset($data['route'])) $medication->setRoute($data['route']);
        if (isset($data['startDate'])) $medication->setStartDate(new \DateTime($data['startDate']));
        if (isset($data['endDate'])) $medication->setEndDate(new \DateTime($data['endDate']));
        if (isset($data['prescribedBy'])) $medication->setPrescribedBy($data['prescribedBy']);
        if (array_key_exists('notes', $data)) $medication->setNotes($data['notes']);

        $this->em->flush();

        return $this->json($medication);
    }

    #[Route('/{id}', name: 'medication_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $medication = $this->medicationRepository->find($id);

        if (!$medication) {
            return $this->json(['error' => 'Medication not found'], Response::HTTP_NOT_FOUND);
        }

        $this->em->remove($medication);
        $this->em->flush();

        return $this->json(['message' => 'Medication deleted']);
    }
}
