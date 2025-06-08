<?php

namespace App\Controller;

use App\Entity\Prescription;
use App\Repository\PrescriptionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/prescriptions')]
class PrescriptionController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private PrescriptionRepository $prescriptionRepository
    ) {}

    #[Route('', name: 'prescription_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        return $this->json($this->prescriptionRepository->findAll());
    }

    #[Route('', name: 'prescription_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $prescription = new Prescription();
        $prescription->setMedicationName($data['medication_name']);
        $prescription->setDose($data['dose']);
        $prescription->setFrequency($data['frequency']);
        $prescription->setDuration($data['duration']);
        $prescription->setIssuedDate(new \DateTime($data['issued_date']));
        $prescription->setStatus($data['status'] ?? 'active');
        $prescription->setCreatedAt(new \DateTime());

        $this->em->persist($prescription);
        $this->em->flush();

        return $this->json($prescription, Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'prescription_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $prescription = $this->prescriptionRepository->find($id);
        if (!$prescription) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($prescription);
    }

    #[Route('/{id}', name: 'prescription_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $prescription = $this->prescriptionRepository->find($id);
        if (!$prescription) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['medication_name'])) $prescription->setMedicationName($data['medication_name']);
        if (isset($data['dose'])) $prescription->setDose($data['dose']);
        if (isset($data['frequency'])) $prescription->setFrequency($data['frequency']);
        if (isset($data['duration'])) $prescription->setDuration($data['duration']);
        if (isset($data['issued_date'])) $prescription->setIssuedDate(new \DateTime($data['issued_date']));
        if (isset($data['status'])) $prescription->setStatus($data['status']);

        $this->em->flush();
        return $this->json($prescription);
    }

    #[Route('/{id}', name: 'prescription_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $prescription = $this->prescriptionRepository->find($id);
        if (!$prescription) {
            return $this->json(['error' => 'Not found'], Response::HTTP_NOT_FOUND);
        }

        $this->em->remove($prescription);
        $this->em->flush();

        return $this->json(['message' => 'Deleted']);
    }
}
