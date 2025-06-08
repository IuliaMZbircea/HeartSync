<?php

namespace App\Controller;

use App\Entity\Consultation;
use App\Repository\ConsultationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/consultations')]
class ConsultationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private ConsultationRepository $consultationRepository
    ) {}

    #[Route('', name: 'consultation_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        return $this->json($this->consultationRepository->findAll());
    }

    #[Route('', name: 'consultation_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $consultation = new Consultation();
        $consultation->setDate(new \DateTime($data['date'] ?? 'now'));
        $consultation->setReason($data['reason'] ?? '');
        $consultation->setSymptoms($data['symptoms'] ?? '');
        $consultation->setDiagnosisIcd10($data['diagnosis_icd10'] ?? '');
        $consultation->setDoctorName($data['doctor_name'] ?? '');
        $consultation->setNotes($data['notes'] ?? null);
        $consultation->setStatus($data['status'] ?? 'active');
        $consultation->setCreatedAt(new \DateTime());

        $this->em->persist($consultation);
        $this->em->flush();

        return $this->json($consultation, Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'consultation_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $consultation = $this->consultationRepository->find($id);

        if (!$consultation) {
            return $this->json(['error' => 'Consultation not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($consultation);
    }

    #[Route('/{id}', name: 'consultation_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $consultation = $this->consultationRepository->find($id);

        if (!$consultation) {
            return $this->json(['error' => 'Consultation not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['date'])) {
            $consultation->setDate(new \DateTime($data['date']));
        }
        if (isset($data['reason'])) {
            $consultation->setReason($data['reason']);
        }
        if (isset($data['symptoms'])) {
            $consultation->setSymptoms($data['symptoms']);
        }
        if (isset($data['diagnosis_icd10'])) {
            $consultation->setDiagnosisIcd10($data['diagnosis_icd10']);
        }
        if (isset($data['doctor_name'])) {
            $consultation->setDoctorName($data['doctor_name']);
        }
        if (array_key_exists('notes', $data)) {
            $consultation->setNotes($data['notes']);
        }
        if (isset($data['status'])) {
            $consultation->setStatus($data['status']);
        }

        $this->em->flush();

        return $this->json($consultation);
    }

    #[Route('/{id}', name: 'consultation_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $consultation = $this->consultationRepository->find($id);

        if (!$consultation) {
            return $this->json(['error' => 'Consultation not found'], Response::HTTP_NOT_FOUND);
        }

        $this->em->remove($consultation);
        $this->em->flush();

        return $this->json(['message' => 'Consultation deleted']);
    }
}
