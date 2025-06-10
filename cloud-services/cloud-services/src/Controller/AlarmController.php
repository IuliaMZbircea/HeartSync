<?php

namespace App\Controller;

use App\Entity\Alarm;
use App\Entity\Patient;
use App\Repository\AlarmRepository;
use App\Repository\PatientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/custom-alarms')]
class AlarmController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private AlarmRepository $alarmRepository,
        private PatientRepository $patientRepository
    ) {}

    #[Route('', name: 'alarm_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $alarms = $this->alarmRepository->findAll();

        $response = array_map(function (Alarm $alarm) {
            return [
                'id' => $alarm->getId(),
                'patientId' => $alarm->getPatient()?->getId(),
                'parameter' => $alarm->getParameter(),
                'conditionType' => $alarm->getConditionType(),
                'threshold' => $alarm->getThreshold(),
                'duration' => $alarm->getDuration(),
                'afterActivity' => $alarm->isAfterActivity(),
                'message' => $alarm->getMessage(),
                'isActive' => $alarm->isActive(),
            ];
        }, $alarms);

        return $this->json($response);
    }

    #[Route('', name: 'alarm_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $patient = $this->patientRepository->find($data['patient_id']);
        if (!$patient) {
            return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
        }

        $alarm = new Alarm();
        $alarm->setPatient($patient);
        $alarm->setParameter($data['parameter'] ?? '');
        $alarm->setConditionType($data['conditionType'] ?? '');
        $alarm->setThreshold((float)($data['threshold'] ?? 0));
        $alarm->setDuration((int)($data['duration'] ?? 0));
        $alarm->setAfterActivity((bool)($data['afterActivity'] ?? false));
        $alarm->setMessage($data['message'] ?? null);
        $alarm->setIsActive($data['isActive'] ?? true);
        $alarm->setCreatedAt(new \DateTime());

        $this->em->persist($alarm);
        $this->em->flush();

        return $this->json([
            'id' => $alarm->getId(),
            'patientId' => $alarm->getPatient()?->getId(),
            'parameter' => $alarm->getParameter(),
            'conditionType' => $alarm->getConditionType(),
            'threshold' => $alarm->getThreshold(),
            'duration' => $alarm->getDuration(),
            'afterActivity' => $alarm->isAfterActivity(),
            'message' => $alarm->getMessage(),
            'isActive' => $alarm->isActive()
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'alarm_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $alarm = $this->alarmRepository->find($id);
        if (!$alarm || !$alarm->isActive()) {
            return $this->json(['error' => 'Alarm not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'id' => $alarm->getId(),
            'patientId' => $alarm->getPatient()?->getId(),
            'parameter' => $alarm->getParameter(),
            'conditionType' => $alarm->getConditionType(),
            'threshold' => $alarm->getThreshold(),
            'duration' => $alarm->getDuration(),
            'afterActivity' => $alarm->isAfterActivity(),
            'message' => $alarm->getMessage(),
            'isActive' => $alarm->isActive()
        ]);
    }

    #[Route('/{id}', name: 'alarm_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $alarm = $this->alarmRepository->find($id);
        if (!$alarm) {
            return $this->json(['error' => 'Alarm not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['patient_id'])) {
            $patient = $this->patientRepository->find($data['patient_id']);
            if (!$patient) {
                return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
            }
            $alarm->setPatient($patient);
        }

        if (isset($data['parameter'])) $alarm->setParameter($data['parameter']);
        if (isset($data['conditionType'])) $alarm->setConditionType($data['conditionType']);
        if (isset($data['threshold'])) $alarm->setThreshold((float)$data['threshold']);
        if (isset($data['duration'])) $alarm->setDuration((int)$data['duration']);
        if (isset($data['afterActivity'])) $alarm->setAfterActivity((bool)$data['afterActivity']);
        if (isset($data['message'])) $alarm->setMessage($data['message']);
        if (isset($data['isActive'])) $alarm->setIsActive((bool)$data['isActive']);

        $this->em->flush();

        return $this->json([
            'id' => $alarm->getId(),
            'patientId' => $alarm->getPatient()?->getId(),
            'parameter' => $alarm->getParameter(),
            'conditionType' => $alarm->getConditionType(),
            'threshold' => $alarm->getThreshold(),
            'duration' => $alarm->getDuration(),
            'afterActivity' => $alarm->isAfterActivity(),
            'message' => $alarm->getMessage(),
            'isActive' => $alarm->isActive()
        ]);
    }

    #[Route('/{id}', name: 'alarm_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $alarm = $this->alarmRepository->find($id);
        if (!$alarm) {
            return $this->json(['error' => 'Alarm not found'], Response::HTTP_NOT_FOUND);
        }

        $alarm->setIsActive(false);
        $this->em->flush();

        return $this->json(['message' => 'Alarm marked as inactive']);
    }
}