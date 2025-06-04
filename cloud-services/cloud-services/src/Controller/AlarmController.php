<?php

namespace App\Controller;

use App\Entity\Alarm;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/alarm')]
class AlarmController extends AbstractController
{
    #[Route('', name: 'alarm_list', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
    {
        $alarms = $em->getRepository(Alarm::class)->findAll();
        return $this->json($alarms);
    }

    #[Route('', name: 'alarm_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $alarm = new Alarm();
        $alarm->setParameter($data['parameter'] ?? null);
        $alarm->setState($data['state'] ?? null);
        $alarm->setThreshold($data['threshold'] ?? null);
        $alarm->setDuration($data['duration'] ?? null);
        $alarm->setAfterActivity($data['afterActivity'] ?? null);
        $alarm->setMessage($data['message'] ?? null);

        $em->persist($alarm);
        $em->flush();

        return $this->json($alarm, 201);
    }

    #[Route('/{id}', name: 'alarm_show', methods: ['GET'])]
    public function show(Alarm $alarm): JsonResponse
    {
        return $this->json($alarm);
    }

    #[Route('/{id}', name: 'alarm_update', methods: ['PUT'])]
    public function update(Request $request, Alarm $alarm, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $alarm->setParameter($data['parameter'] ?? $alarm->getParameter());
        $alarm->setState($data['state'] ?? $alarm->getState());
        $alarm->setThreshold($data['threshold'] ?? $alarm->getThreshold());
        $alarm->setDuration($data['duration'] ?? $alarm->getDuration());
        $alarm->setAfterActivity($data['afterActivity'] ?? $alarm->isAfterActivity());
        $alarm->setMessage($data['message'] ?? $alarm->getMessage());

        $em->flush();

        return $this->json($alarm);
    }

    #[Route('/{id}', name: 'alarm_delete', methods: ['DELETE'])]
    public function delete(Alarm $alarm, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($alarm);
        $em->flush();

        return $this->json(['message' => 'Deleted successfully']);
    }
}
