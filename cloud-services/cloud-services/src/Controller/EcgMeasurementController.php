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
    private const BUFFER_DIR = __DIR__ . '/../../var/ecg_buffers';

    #[Route('/single', name: 'post_single_waveform', methods: ['POST'])]
    public function postWaveform(
        Request $request,
        PatientRepository $patientRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['patient_id'], $data['waveform'])) {
            return $this->json(['error' => 'Missing parameters'], 400);
        }

        $patientId = (int)$data['patient_id'];
        $waveform = (float)$data['waveform'];
        $sendAlarm = isset($data['send_alarm']) ? (bool)$data['send_alarm'] : false;

        $patient = $patientRepository->find($patientId);
        if (!$patient) {
            return $this->json(['error' => 'Patient not found'], 404);
        }

        if (!is_dir(self::BUFFER_DIR)) {
            mkdir(self::BUFFER_DIR, 0777, true);
        }

        $bufferFile = self::BUFFER_DIR . "/patient_{$patientId}.json";

        $buffer = [];
        if (file_exists($bufferFile)) {
            $json = file_get_contents($bufferFile);
            $buffer = json_decode($json, true) ?? [];
        }

        $buffer[] = $waveform;

        if (count($buffer) >= 5) {
            $ecg = new EcgMeasurement();
            $ecg->setPatient($patient);
            $ecg->setWaveforms($buffer);
            $ecg->setSendAlarm($sendAlarm);

            $em->persist($ecg);
            $em->flush();

            unlink($bufferFile);

            return $this->json([
                'success' => true,
                'message' => 'Measurement saved',
                'waveforms' => $buffer,
                'timestamp' => $ecg->getCreatedAt()->format('Y-m-d H:i:s'),
                'send_alarm' => $ecg->isSendAlarm()
            ]);
        } else {
            file_put_contents($bufferFile, json_encode($buffer));

            return $this->json([
                'success' => true,
                'message' => 'Waveform buffered',
                'current_count' => count($buffer)
            ]);
        }
    }

    #[Route('', name: 'get_all_ecg', methods: ['GET'])]
    public function getAll(EcgMeasurementRepository $repo): JsonResponse
    {
        $list = $repo->findAll();

        $data = array_map(function (EcgMeasurement $e) {
            return [
                'id' => $e->getId(),
                'patient_id' => $e->getPatient()->getId(),
                'waveforms' => $e->getWaveforms(),
                'created_at' => $e->getCreatedAt()->format('Y-m-d H:i:s'),
                'send_alarm' => $e->isSendAlarm()
            ];
        }, $list);

        return $this->json($data);
    }

    #[Route('/{id}', name: 'get_ecg_by_id', methods: ['GET'])]
    public function getById(EcgMeasurement $ecg): JsonResponse
    {
        return $this->json([
            'id' => $ecg->getId(),
            'patient_id' => $ecg->getPatient()->getId(),
            'waveforms' => $ecg->getWaveforms(),
            'created_at' => $ecg->getCreatedAt()->format('Y-m-d H:i:s'),
            'send_alarm' => $ecg->isSendAlarm()
        ]);
    }

    #[Route('/{id}', name: 'update_ecg', methods: ['PUT'])]
    public function update(
        Request $request,
        EcgMeasurement $ecg,
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (isset($data['waveforms']) && is_array($data['waveforms'])) {
            $ecg->setWaveforms($data['waveforms']);
        }

        if (isset($data['send_alarm'])) {
            $ecg->setSendAlarm((bool)$data['send_alarm']);
        }

        $em->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/{id}', name: 'delete_ecg', methods: ['DELETE'])]
    public function delete(EcgMeasurement $ecg, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($ecg);
        $em->flush();

        return $this->json(['success' => true]);
    }
}
