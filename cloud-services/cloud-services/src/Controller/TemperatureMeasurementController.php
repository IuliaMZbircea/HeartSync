<?php

namespace App\Controller;

use App\Entity\TemperatureMeasurement;
use App\Repository\TemperatureMeasurementRepository;
use App\Repository\PatientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/temperature')]
class TemperatureMeasurementController extends AbstractController
{
    #[Route('', name: 'post_temperature', methods: ['POST'])]
    public function post(
        Request $request,
        PatientRepository $patientRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['patient_id'], $data['temperature'])) {
            return $this->json(['error' => 'Missing parameters'], 400);
        }

        $patient = $patientRepository->find($data['patient_id']);
        if (!$patient) {
            return $this->json(['error' => 'Patient not found'], 404);
        }

        $temperature = new TemperatureMeasurement();
        $temperature->setPatient($patient);
        $temperature->setTemperature((float)$data['temperature']);
        $temperature->setSendAlarm(isset($data['send_alarm']) ? (bool)$data['send_alarm'] : false);

        $em->persist($temperature);
        $em->flush();

        return $this->json([
            'success' => true,
            'id' => $temperature->getId(),
            'timestamp' => $temperature->getCreatedAt()->format('Y-m-d H:i:s'),
            'send_alarm' => $temperature->isSendAlarm()
        ]);
    }

    #[Route('', name: 'get_all_temperature', methods: ['GET'])]
    public function getAll(TemperatureMeasurementRepository $repo): JsonResponse
    {
        $all = $repo->findAll();

        $data = array_map(function (TemperatureMeasurement $t) {
            return [
                'id' => $t->getId(),
                'patient_id' => $t->getPatient()->getId(),
                'temperature' => $t->getTemperature(),
                'created_at' => $t->getCreatedAt()->format('Y-m-d H:i:s'),
                'send_alarm' => $t->isSendAlarm()
            ];
        }, $all);

        return $this->json($data);
    }

    #[Route('/{patientId}', name: 'get_temperature_by_patient', methods: ['GET'])]
    public function getByPatient(
        int $patientId,
        TemperatureMeasurementRepository $temperatureRepo,
        PatientRepository $patientRepo
    ): JsonResponse {
        $patient = $patientRepo->find($patientId);
        if (!$patient) {
            return $this->json(['error' => 'Patient not found'], 404);
        }

        $items = $temperatureRepo->findBy(
            ['patient' => $patient],
            ['createdAt' => 'DESC']
        );

        $data = array_map(function (TemperatureMeasurement $t) {
            return [
                'id' => $t->getId(),
                'temperature' => $t->getTemperature(),
                'created_at' => $t->getCreatedAt()->format('Y-m-d H:i:s'),
                'send_alarm' => $t->isSendAlarm()
            ];
        }, $items);

        return $this->json($data);
    }
}
