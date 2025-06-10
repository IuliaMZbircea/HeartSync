<?php

namespace App\Controller;

use App\Entity\EcgMeasurement;
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

        // Ensure buffer directory exists
        if (!is_dir(self::BUFFER_DIR)) {
            mkdir(self::BUFFER_DIR, 0777, true);
        }

        $bufferFile = self::BUFFER_DIR . "/patient_{$patientId}.json";

        // Read current buffer
        $buffer = [];
        if (file_exists($bufferFile)) {
            $json = file_get_contents($bufferFile);
            $buffer = json_decode($json, true) ?? [];
        }

        // Add new waveform
        $buffer[] = $waveform;

        if (count($buffer) >= 5) {
            // Save to DB
            $ecg = new EcgMeasurement();
            $ecg->setPatient($patient);
            $ecg->setWaveforms($buffer);
            $ecg->setSendAlarm($sendAlarm);

            $em->persist($ecg);
            $em->flush();

            // Clear buffer
            unlink($bufferFile);

            return $this->json([
                'success' => true,
                'message' => 'Measurement saved',
                'waveforms' => $buffer,
                'timestamp' => $ecg->getCreatedAt()->format('Y-m-d H:i:s'),
                'send_alarm' => $ecg->isSendAlarm()
            ]);
        } else {
            // Save buffer back
            file_put_contents($bufferFile, json_encode($buffer));

            return $this->json([
                'success' => true,
                'message' => 'Waveform buffered',
                'current_count' => count($buffer)
            ]);
        }
    }
}
