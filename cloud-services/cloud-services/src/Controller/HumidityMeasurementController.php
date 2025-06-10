<?php

namespace App\Controller;

use App\Entity\HumidityMeasurement;
use App\Repository\HumidityMeasurementRepository;
use App\Repository\PatientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/humidity')]
class HumidityMeasurementController extends AbstractController
{
    #[Route('', name: 'post_humidity', methods: ['POST'])]
    public function post(
        Request $request,
        PatientRepository $patientRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['patient_id'], $data['humidity'])) {
            return $this->json(['error' => 'Missing parameters'], 400);
        }

        $patient = $patientRepository->find($data['patient_id']);
        if (!$patient) {
            return $this->json(['error' => 'Patient not found'], 404);
        }

        $humidity = new HumidityMeasurement();
        $humidity->setPatient($patient);
        $humidity->setHumidity((float)$data['humidity']);
        $humidity->setSendAlarm(isset($data['send_alarm']) ? (bool)$data['send_alarm'] : false);

        $em->persist($humidity);
        $em->flush();

        return $this->json([
            'success' => true,
            'id' => $humidity->getId(),
            'timestamp' => $humidity->getCreatedAt()->format('Y-m-d H:i:s'),
            'send_alarm' => $humidity->isSendAlarm()
        ]);
    }

    #[Route('', name: 'get_all_humidity', methods: ['GET'])]
    public function getAll(HumidityMeasurementRepository $repo): JsonResponse
    {
        $all = $repo->findAll();

        $data = array_map(function (HumidityMeasurement $h) {
            return [
                'id' => $h->getId(),
                'patient_id' => $h->getPatient()->getId(),
                'humidity' => $h->getHumidity(),
                'created_at' => $h->getCreatedAt()->format('Y-m-d H:i:s'),
                'send_alarm' => $h->isSendAlarm()
            ];
        }, $all);

        return $this->json($data);
    }

    #[Route('/{patientId}', name: 'get_humidity_by_patient', methods: ['GET'])]
    public function getByPatient(
        int $patientId,
        HumidityMeasurementRepository $humidityRepo,
        PatientRepository $patientRepo
    ): JsonResponse {
        $patient = $patientRepo->find($patientId);
        if (!$patient) {
            return $this->json(['error' => 'Patient not found'], 404);
        }

        $items = $humidityRepo->findBy(
            ['patient' => $patient],
            ['createdAt' => 'DESC']
        );

        $data = array_map(function (HumidityMeasurement $h) {
            return [
                'id' => $h->getId(),
                'humidity' => $h->getHumidity(),
                'created_at' => $h->getCreatedAt()->format('Y-m-d H:i:s'),
                'send_alarm' => $h->isSendAlarm()
            ];
        }, $items);

        return $this->json($data);
    }
}
