<?php

namespace App\Controller;

use App\Entity\Consultation;
use App\Entity\Patient;
use App\Repository\ConsultationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/custom-consultations')]
class ConsultationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private ConsultationRepository $consultationRepository
    ) {}

    #[Route('', name: 'consultation_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $consultations = $this->consultationRepository->findAll();

        $response = array_map(function (Consultation $consultation) {
            return [
                'id' => $consultation->getId(),
                'patient' => [
                    'id' => $consultation->getPatient()?->getId()
                ],
                'dateTime' => $consultation->getDateTime()?->format('Y-m-d H:i:s'),
                'doctorName' => $consultation->getDoctorName(),
                'durationMinutes' => $consultation->getDurationMinutes(),
                'symptoms' => $consultation->getSymptoms(),
                'currentMedicationIds' => $consultation->getCurrentMedicationIds(),
                'medicalHistoryIds' => $consultation->getMedicalHistoryIds(),
                'familyHistory' => $consultation->getFamilyHistory(),
                'pulse' => $consultation->getPulse(),
                'bloodPressure' => $consultation->getBloodPressure(),
                'temperature' => $consultation->getTemperature(),
                'weightKg' => $consultation->getWeightKg(),
                'heightCm' => $consultation->getHeightCm(),
                'respiratoryRate' => $consultation->getRespiratoryRate(),
                'notes' => $consultation->getNotes(),
                'diagnosisIds' => $consultation->getDiagnosisIds(),
                'referralIds' => $consultation->getReferralIds(),
                'prescriptionIds' => $consultation->getPrescriptionIds(),
                'isActive' => $consultation->isActive(),
                'hl7' => [
                    'resourceType' => 'Encounter',
                    'id' => $consultation->getId(),
                    'status' => 'finished',
                    'subject' => [ 'reference' => '/api/patients/' . $consultation->getPatient()?->getId() ],
                    'type' => [[ 'text' => $consultation->getDiagnosisIds() ]],
                    'reasonCode' => [[ 'text' => $consultation->getSymptoms() ]],
                    'note' => [[ 'text' => $consultation->getNotes() ]]
                ]
            ];
        }, $consultations);

        return $this->json($response);
    }

    #[Route('', name: 'consultation_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (!isset($data['patient_id'])) {
            return $this->json(['error' => 'Missing patient_id'], Response::HTTP_BAD_REQUEST);
        }

        $patient = $this->em->getRepository(Patient::class)->find($data['patient_id']);
        if (!$patient) {
            return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
        }

        $consultation = new Consultation();
        $consultation->setPatient($patient);
        $consultation->setDateTime(new \DateTime($data['dateTime'] ?? 'now'));
        $consultation->setDoctorName($this->getUser()?->getUserIdentifier() ?? 'Unknown');
        $consultation->setDurationMinutes($data['durationMinutes'] ?? null);
        $consultation->setSymptoms($data['symptoms'] ?? '');
        $consultation->setCurrentMedicationIds($data['currentMedicationIds'] ?? null);
        $consultation->setMedicalHistoryIds($data['medicalHistoryIds'] ?? null);
        $consultation->setFamilyHistory($data['familyHistory'] ?? null);
        $consultation->setPulse($data['pulse'] ?? null);
        $consultation->setBloodPressure($data['bloodPressure'] ?? null);
        $consultation->setTemperature($data['temperature'] ?? null);
        $consultation->setWeightKg($data['weightKg'] ?? null);
        $consultation->setHeightCm($data['heightCm'] ?? null);
        $consultation->setRespiratoryRate($data['respiratoryRate'] ?? null);
        $consultation->setNotes($data['notes'] ?? null);
        $consultation->setDiagnosisIds($data['diagnosisIds'] ?? null);
        $consultation->setReferralIds($data['referralIds'] ?? null);
        $consultation->setPrescriptionIds($data['prescriptionIds'] ?? null);
        $consultation->setIsActive(true);
        $consultation->setCreatedAt(new \DateTime());

        $this->em->persist($consultation);
        $this->em->flush();

        return $this->json([
            'consultation' => $consultation->getId(),
            'hl7' => [
                'resourceType' => 'Encounter',
                'id' => $consultation->getId(),
                'status' => 'finished',
                'subject' => [ 'reference' => '/api/patients/' . $patient->getId() ],
                'type' => [[ 'text' => $consultation->getDiagnosisIds() ]],
                'reasonCode' => [[ 'text' => $consultation->getSymptoms() ]],
                'note' => [[ 'text' => $consultation->getNotes() ]]
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'consultation_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $consultation = $this->consultationRepository->find($id);
        if (!$consultation || !$consultation->isActive()) {
            return $this->json(['error' => 'Consultation not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'consultation' => $consultation->getId(),
            'hl7' => [
                'resourceType' => 'Encounter',
                'id' => $consultation->getId(),
                'status' => 'finished',
                'subject' => [ 'reference' => '/api/patients/' . $consultation->getPatient()?->getId() ],
                'type' => [[ 'text' => $consultation->getDiagnosisIds() ]],
                'reasonCode' => [[ 'text' => $consultation->getSymptoms() ]],
                'note' => [[ 'text' => $consultation->getNotes() ]]
            ]
        ]);
    }

    #[Route('/{id}', name: 'consultation_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $consultation = $this->consultationRepository->find($id);
        if (!$consultation) {
            return $this->json(['error' => 'Consultation not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['patient_id'])) {
            $patient = $this->em->getRepository(Patient::class)->find($data['patient_id']);
            if (!$patient) {
                return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
            }
            $consultation->setPatient($patient);
        }

        if (isset($data['dateTime'])) $consultation->setDateTime(new \DateTime($data['dateTime']));
        if (isset($data['durationMinutes'])) $consultation->setDurationMinutes($data['durationMinutes']);
        if (isset($data['symptoms'])) $consultation->setSymptoms($data['symptoms']);
        if (isset($data['currentMedicationIds'])) $consultation->setCurrentMedicationIds($data['currentMedicationIds']);
        if (isset($data['medicalHistoryIds'])) $consultation->setMedicalHistoryIds($data['medicalHistoryIds']);
        if (isset($data['familyHistory'])) $consultation->setFamilyHistory($data['familyHistory']);
        if (isset($data['pulse'])) $consultation->setPulse($data['pulse']);
        if (isset($data['bloodPressure'])) $consultation->setBloodPressure($data['bloodPressure']);
        if (isset($data['temperature'])) $consultation->setTemperature($data['temperature']);
        if (isset($data['weightKg'])) $consultation->setWeightKg($data['weightKg']);
        if (isset($data['heightCm'])) $consultation->setHeightCm($data['heightCm']);
        if (isset($data['respiratoryRate'])) $consultation->setRespiratoryRate($data['respiratoryRate']);
        if (array_key_exists('notes', $data)) $consultation->setNotes($data['notes']);
        if (isset($data['diagnosisIds'])) $consultation->setDiagnosisIds($data['diagnosisIds']);
        if (isset($data['referralIds'])) $consultation->setReferralIds($data['referralIds']);
        if (isset($data['prescriptionIds'])) $consultation->setPrescriptionIds($data['prescriptionIds']);
        if (isset($data['isActive'])) $consultation->setIsActive((bool)$data['isActive']);

        $this->em->flush();

        return $this->json([
            'consultation' => $consultation->getId(),
            'hl7' => [
                'resourceType' => 'Encounter',
                'id' => $consultation->getId(),
                'status' => 'finished',
                'subject' => [ 'reference' => '/api/patients/' . $consultation->getPatient()?->getId() ],
                'type' => [[ 'text' => $consultation->getDiagnosisIds() ]],
                'reasonCode' => [[ 'text' => $consultation->getSymptoms() ]],
                'note' => [[ 'text' => $consultation->getNotes() ]]
            ]
        ]);
    }

    #[Route('/{id}', name: 'consultation_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $consultation = $this->consultationRepository->find($id);
        if (!$consultation) {
            return $this->json(['error' => 'Consultation not found'], Response::HTTP_NOT_FOUND);
        }

        $consultation->setIsActive(false);
        $this->em->flush();

        return $this->json(['message' => 'Consultation marked as inactive']);
    }
}