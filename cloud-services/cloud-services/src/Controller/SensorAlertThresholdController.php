<?php

namespace App\Controller;

use App\Entity\SensorAlertThreshold;
use App\Entity\Patient;
use App\Repository\SensorAlertThresholdRepository;
use App\Repository\PatientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/thresholds')]
class SensorAlertThresholdController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(SensorAlertThresholdRepository $repository): JsonResponse
    {
        $thresholds = $repository->findBy(['isActive' => true]);
        return $this->json($thresholds);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(SensorAlertThresholdRepository $repository, $id): JsonResponse
    {
        $threshold = $repository->find($id);

        if (!$threshold || !$threshold->isActive()) {
            return $this->json(['error' => 'Not found'], 404);
        }

        return $this->json($threshold);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, PatientRepository $patientRepo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $patient = $patientRepo->find($data['patient_id'] ?? null);
        if (!$patient) {
            return $this->json(['error' => 'Invalid patient_id'], 400);
        }

        $threshold = new SensorAlertThreshold();
        $threshold->setPatient($patient);
        $threshold->setParameter($data['parameter']);
        $threshold->setMinValue($data['minValue']);
        $threshold->setMaxValue($data['maxValue']);
        $threshold->setDurationMinutes($data['durationMinutes']);
        $threshold->setMessage($data['message']);
        $threshold->setIsActive(true);

        $em->persist($threshold);
        $em->flush();

        return $this->json($threshold, 201);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update($id, Request $request, SensorAlertThresholdRepository $repository, PatientRepository $patientRepo, EntityManagerInterface $em): JsonResponse
    {
        $threshold = $repository->find($id);
        if (!$threshold || !$threshold->isActive()) {
            return $this->json(['error' => 'Not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['parameter'])) $threshold->setParameter($data['parameter']);
        if (isset($data['minValue'])) $threshold->setMinValue($data['minValue']);
        if (isset($data['maxValue'])) $threshold->setMaxValue($data['maxValue']);
        if (isset($data['durationMinutes'])) $threshold->setDurationMinutes($data['durationMinutes']);
        if (isset($data['message'])) $threshold->setMessage($data['message']);
        if (isset($data['isActive'])) $threshold->setIsActive($data['isActive']);

        if (isset($data['patient_id'])) {
            $patient = $patientRepo->find($data['patient_id']);
            if (!$patient) {
                return $this->json(['error' => 'Invalid patient_id'], 400);
            }
            $threshold->setPatient($patient);
        }

        $em->flush();
        return $this->json($threshold);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete($id, SensorAlertThresholdRepository $repository, EntityManagerInterface $em): JsonResponse
    {
        $threshold = $repository->find($id);
        if (!$threshold || !$threshold->isActive()) {
            return $this->json(['error' => 'Not found'], 404);
        }

        $threshold->setIsActive(false);
        $em->flush();

        return $this->json(['message' => 'Soft deleted']);
    }
}
