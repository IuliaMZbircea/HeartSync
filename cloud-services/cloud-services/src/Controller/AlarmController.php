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
        return $this->json($this->alarmRepository->findAll());
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
        $alarm->setConditionType($data['condition'] ?? '');
        $alarm->setThreshold((float)($data['threshold'] ?? 0));
        $alarm->setDuration((int)($data['duration'] ?? 0));
        $alarm->setAfterActivity((bool)($data['afterActivity'] ?? false));
        $alarm->setMessage($data['message'] ?? '');

        $this->em->persist($alarm);
        $this->em->flush();

        return $this->json($alarm, Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'alarm_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $alarm = $this->alarmRepository->find($id);

        if (!$alarm) {
            return $this->json(['error' => 'Alarm not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($alarm);
    }

    #[Route('/{id}', name: 'alarm_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $alarm = $this->alarmRepository->find($id);

        if (!$alarm) {
            return $this->json(['error' => 'Alarm not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['parameter']))      $alarm->setParameter($data['parameter']);
        if (isset($data['condition']))      $alarm->setCondition($data['condition']);
        if (isset($data['threshold']))      $alarm->setThreshold((float)$data['threshold']);
        if (isset($data['duration']))       $alarm->setDuration((int)$data['duration']);
        if (isset($data['afterActivity']))  $alarm->setAfterActivity((bool)$data['afterActivity']);
        if (isset($data['message']))        $alarm->setMessage($data['message']);

        $this->em->flush();

        return $this->json($alarm);
    }

    #[Route('/{id}', name: 'alarm_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $alarm = $this->alarmRepository->find($id);

        if (!$alarm) {
            return $this->json(['error' => 'Alarm not found'], Response::HTTP_NOT_FOUND);
        }

        $this->em->remove($alarm);
        $this->em->flush();

        return $this->json(['message' => 'Alarm deleted']);
    }
}
