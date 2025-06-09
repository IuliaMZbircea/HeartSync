<?php

namespace App\Controller;

use App\Entity\Alarm;
use App\Repository\AlarmRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/alarms')]
class AlarmController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private AlarmRepository $alarmRepository
    ) {}

    #[Route('', name: 'alarm_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $alarms = $this->alarmRepository->findBy(['status' => true]);

        $response = array_map(function (Alarm $alarm) {
            return [
                'id' => $alarm->getId(),
                'parameter' => $alarm->getParameter(),
                'conditionType' => $alarm->getConditionType(),
                'threshold' => $alarm->getThreshold(),
                'duration' => $alarm->getDuration(),
                'afterActivity' => $alarm->isAfterActivity(),
                'message' => $alarm->getMessage(),
                'status' => $alarm->getStatus(),
                'hl7' => [
                    'resourceType' => 'Observation',
                    'id' => $alarm->getId(),
                    'code' => ['text' => $alarm->getParameter()],
                    'valueQuantity' => ['value' => $alarm->getThreshold()],
                    'interpretation' => ['text' => $alarm->getConditionType()],
                    'note' => [['text' => $alarm->getMessage()]]
                ]
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

        $alarm = new Alarm();
        $alarm->setParameter($data['parameter'] ?? '');
        $alarm->setConditionType($data['conditionType'] ?? '');
        $alarm->setThreshold((float)($data['threshold'] ?? 0));
        $alarm->setDuration((int)($data['duration'] ?? 0));
        $alarm->setAfterActivity((bool)($data['afterActivity'] ?? false));
        $alarm->setMessage($data['message'] ?? null);
        $alarm->setStatus($data['status'] ?? true);
        $alarm->setCreatedAt(new \DateTime());

        $this->em->persist($alarm);
        $this->em->flush();

        return $this->json([
            'alarm' => $alarm,
            'hl7' => [
                'resourceType' => 'Observation',
                'id' => $alarm->getId(),
                'code' => ['text' => $alarm->getParameter()],
                'valueQuantity' => ['value' => $alarm->getThreshold()],
                'interpretation' => ['text' => $alarm->getConditionType()],
                'note' => [['text' => $alarm->getMessage()]]
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'alarm_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $alarm = $this->alarmRepository->find($id);
        if (!$alarm || !$alarm->getStatus()) {
            return $this->json(['error' => 'Alarm not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'alarm' => $alarm,
            'hl7' => [
                'resourceType' => 'Observation',
                'id' => $alarm->getId(),
                'code' => ['text' => $alarm->getParameter()],
                'valueQuantity' => ['value' => $alarm->getThreshold()],
                'interpretation' => ['text' => $alarm->getConditionType()],
                'note' => [['text' => $alarm->getMessage()]]
            ]
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

        if (isset($data['parameter'])) $alarm->setParameter($data['parameter']);
        if (isset($data['conditionType'])) $alarm->setConditionType($data['conditionType']);
        if (isset($data['threshold'])) $alarm->setThreshold((float)$data['threshold']);
        if (isset($data['duration'])) $alarm->setDuration((int)$data['duration']);
        if (isset($data['afterActivity'])) $alarm->setAfterActivity((bool)$data['afterActivity']);
        if (isset($data['message'])) $alarm->setMessage($data['message']);
        if (isset($data['status'])) $alarm->setStatus((bool)$data['status']);

        $this->em->flush();

        return $this->json([
            'alarm' => $alarm,
            'hl7' => [
                'resourceType' => 'Observation',
                'id' => $alarm->getId(),
                'code' => ['text' => $alarm->getParameter()],
                'valueQuantity' => ['value' => $alarm->getThreshold()],
                'interpretation' => ['text' => $alarm->getConditionType()],
                'note' => [['text' => $alarm->getMessage()]]
            ]
        ]);
    }

    #[Route('/{id}', name: 'alarm_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $alarm = $this->alarmRepository->find($id);
        if (!$alarm) {
            return $this->json(['error' => 'Alarm not found'], Response::HTTP_NOT_FOUND);
        }

        $alarm->setStatus(false);
        $this->em->flush();

        return $this->json(['message' => 'Alarm marked as inactive']);
    }
}
