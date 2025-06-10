<?php

namespace App\Controller;

use App\Entity\EcgMeasurement;
use App\Repository\EcgMeasurementRepository;
use App\Repository\PatientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/ecg')]
class EcgMeasurementController extends AbstractController
{
    #[Route('', name: 'post_ecg', methods: ['POST'])]
    public function post(
        Request $request,
        PatientRepository $patientRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['patient_id'], $data['waveform'])) {
            return $this->json(['error' => 'Missing parameters'], 400);
        }

        $patient = $patientRepository->find($data['patient_id']);
        if (!$patient) {
            return $this->json(['error' => 'Patient not found'], 404);
        }

        $ecg = new EcgMeasurement();
        $ecg->setPatient($patient);
        $ecg->setWaveform($data['waveform']);
        $ecg->setSendAlarm(isset($data['send_alarm']) ? (bool)$data['send_alarm'] : false);

        $em->persist($ecg);
        $em->flush();

        return $this->json([
            'success' => true,
            'id' => $ecg->getId(),
            'timestamp' => $ecg->getCreatedAt()->format('Y-m-d H:i:s'),
            'send_alarm' => $ecg->isSendAlarm()
        ]);
    }

    #[Route('', name: 'get_all_ecg', methods: ['GET'])]
    public function getAll(EcgMeasurementRepository $repo): JsonResponse
    {
        $all = $repo->findAll();

        $data = array_map(function (EcgMeasurement $e) {
            return [
                'id' => $e->getId(),
                'patient_id' => $e->getPatient()->getId(),
                'waveform' => $e->getWaveform(),
                'created_at' => $e->getCreatedAt()->format('Y-m-d H:i:s'),
                'send_alarm' => $e->isSendAlarm()
            ];
        }, $all);

        return $this->json($data);
    }

    #[Route('/{patientId}', name: 'get_ecg_by_patient', methods: ['GET'])]
    public function getByPatient(
        int $patientId,
        EcgMeasurementRepository $ecgRepo,
        PatientRepository $patientRepo
    ): JsonResponse {
        $patient = $patientRepo->find($patientId);
        if (!$patient) {
            return $this->json(['error' => 'Patient not found'], 404);
        }

        $items = $ecgRepo->findBy(
            ['patient' => $patient],
            ['createdAt' => 'DESC']
        );

        $data = array_map(function (EcgMeasurement $e) {
            return [
                'id' => $e->getId(),
                'waveform' => $e->getWaveform(),
                'created_at' => $e->getCreatedAt()->format('Y-m-d H:i:s'),
                'send_alarm' => $e->isSendAlarm()
            ];
        }, $items);

        return $this->json($data);
    }
}
