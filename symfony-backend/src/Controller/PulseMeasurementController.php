<?php

namespace App\Controller;

use App\Entity\PulseMeasurement;
use App\Repository\PulseMeasurementRepository;
use App\Repository\PatientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Psr\Log\LoggerInterface;

#[Route('/pulse')]
class PulseMeasurementController extends AbstractController
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    #[Route('', name: 'post_pulse_measurements', methods: ['POST'])]
    public function postPulse(
        Request $request,
        PatientRepository $patientRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);
            
            $this->logger->info('Received pulse measurement', ['data' => $data]);

            if (!isset($data['patient_id'], $data['pulse'])) {
                return $this->json(['error' => 'Missing parameters'], 400);
            }

            $patient = $patientRepository->find($data['patient_id']);
            if (!$patient) {
                return $this->json(['error' => 'Patient not found'], 404);
            }

            $pulse = new PulseMeasurement();
            $pulse->setPatient($patient);
            $pulse->setPulse((int)$data['pulse']);
            $pulse->setSendAlarm(isset($data['send_alarm']) ? (bool)$data['send_alarm'] : false);
            $pulse->setCreatedAt(new \DateTime());

            $em->persist($pulse);
            $em->flush();

            $this->logger->info('Pulse measurement saved', [
                'id' => $pulse->getId(),
                'patient_id' => $patient->getId(),
                'pulse' => $pulse->getPulse()
            ]);

            return $this->json([
                'success' => true,
                'id' => $pulse->getId(),
                'timestamp' => $pulse->getCreatedAt()->format('Y-m-d H:i:s'),
                'send_alarm' => $pulse->isSendAlarm()
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Error saving pulse measurement', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->json(['error' => 'Internal server error'], 500);
        }
    }

    #[Route('', name: 'get_all_pulses', methods: ['GET'])]
    public function getAll(PulseMeasurementRepository $repo): JsonResponse
    {
        try {
            $pulses = $repo->findAll();

            $data = array_map(function (PulseMeasurement $pulse) {
                return [
                    'id' => $pulse->getId(),
                    'patient_id' => $pulse->getPatient()->getId(),
                    'pulse' => $pulse->getPulse(),
                    'created_at' => $pulse->getCreatedAt()->format('Y-m-d H:i:s'),
                    'send_alarm' => $pulse->isSendAlarm()
                ];
            }, $pulses);

            return $this->json($data);
        } catch (\Exception $e) {
            $this->logger->error('Error fetching pulse measurements', [
                'error' => $e->getMessage()
            ]);
            
            return $this->json(['error' => 'Internal server error'], 500);
        }
    }

    #[Route('/{patientId}', name: 'get_pulses_by_patient', methods: ['GET'])]
    public function getPulseByPatient(
        int $patientId,
        PulseMeasurementRepository $pulseRepo,
        PatientRepository $patientRepo
    ): JsonResponse {
        try {
            $patient = $patientRepo->find($patientId);
            if (!$patient) {
                return $this->json(['error' => 'Patient not found'], 404);
            }

            $pulses = $pulseRepo->findBy(
                ['patient' => $patient],
                ['createdAt' => 'DESC']
            );

            $data = array_map(function (PulseMeasurement $pulse) {
                return [
                    'id' => $pulse->getId(),
                    'pulse' => $pulse->getPulse(),
                    'created_at' => $pulse->getCreatedAt()->format('Y-m-d H:i:s'),
                    'send_alarm' => $pulse->isSendAlarm()
                ];
            }, $pulses);

            return $this->json($data);
        } catch (\Exception $e) {
            $this->logger->error('Error fetching patient pulse measurements', [
                'error' => $e->getMessage(),
                'patient_id' => $patientId
            ]);
            
            return $this->json(['error' => 'Internal server error'], 500);
        }
    }
} 