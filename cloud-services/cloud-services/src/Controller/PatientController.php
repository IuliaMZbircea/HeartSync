<?php

namespace App\Controller;

use App\Entity\Patient;
use App\Repository\PatientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/custom-patients')]
class PatientController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private PatientRepository $patientRepository
    ) {}

    #[Route('', name: 'patient_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $patients = $this->patientRepository->findAll();

        $response = array_map(function (Patient $patient) {
            return $this->serializePatient($patient);
        }, $patients);

        return $this->json($response);
    }

    #[Route('/{id}', name: 'patient_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $patient = $this->patientRepository->find($id);

        if (!$patient || !$patient->isIsActive()) {
            return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->serializePatient($patient));
    }

    #[Route('', name: 'patient_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $patient = new Patient();
        $patient->setEmail($data['email'] ?? '');
        $patient->setPhone($data['phone'] ?? '');
        $patient->setFirstName($data['firstName'] ?? '');
        $patient->setLastName($data['lastName'] ?? '');
        $patient->setCnp($data['cnp'] ?? '');
        $patient->setOccupation($data['occupation'] ?? '');
        $patient->setLocality($data['locality'] ?? '');
        $patient->setStreet($data['street'] ?? '');
        $patient->setNumber($data['number'] ?? '');
        $patient->setBlock($data['block'] ?? null);
        $patient->setStaircase($data['staircase'] ?? null);
        $patient->setApartment($data['apartment'] ?? null);
        $patient->setFloor($data['floor'] ?? null);
        $patient->setBloodGroup($data['bloodGroup'] ?? '');
        $patient->setRh($data['rh'] ?? '');
        $patient->setWeight($data['weight'] ?? 0);
        $patient->setHeight($data['height'] ?? 0);
        $patient->setValidAccount(true);
        $patient->setBirthDate(isset($data['birthDate']) ? new \DateTime($data['birthDate']) : null);
        $patient->setSex($data['sex'] ?? null);
        $patient->setPatientHistory($data['patient_history'] ?? []);
        $patient->setCreatedAt(new \DateTime());
        $patient->setIsActive(true);

        $this->em->persist($patient);
        $this->em->flush();

        return $this->json(['message' => 'Patient created', 'id' => $patient->getId()], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'patient_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $patient = $this->patientRepository->find($id);
        if (!$patient || !$patient->isIsActive()) {
            return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $patient->setEmail($data['email'] ?? $patient->getEmail());
        $patient->setPhone($data['phone'] ?? $patient->getPhone());
        $patient->setFirstName($data['first_name'] ?? $patient->getFirstName());
        $patient->setLastName($data['last_name'] ?? $patient->getLastName());
        $patient->setOccupation($data['occupation'] ?? $patient->getOccupation());
        $patient->setLocality($data['locality'] ?? $patient->getLocality());
        $patient->setStreet($data['street'] ?? $patient->getStreet());
        $patient->setNumber($data['number'] ?? $patient->getNumber());
        $patient->setBlock($data['block'] ?? $patient->getBlock());
        $patient->setStaircase($data['staircase'] ?? $patient->getStaircase());
        $patient->setApartment($data['apartment'] ?? $patient->getApartment());
        $patient->setFloor($data['floor'] ?? $patient->getFloor());
        $patient->setBloodGroup($data['blood_group'] ?? $patient->getBloodGroup());
        $patient->setRh($data['rh'] ?? $patient->getRh());
        $patient->setWeight($data['weight'] ?? $patient->getWeight());
        $patient->setHeight($data['height'] ?? $patient->getHeight());
        $patient->setBirthDate(isset($data['birth_date']) ? new \DateTime($data['birth_date']) : $patient->getBirthDate());
        $patient->setSex($data['sex'] ?? $patient->getSex());
        $patient->setPatientHistory($data['patient_history'] ?? $patient->getPatientHistory());

        $this->em->flush();

        return $this->json(['message' => 'Patient updated']);
    }

    #[Route('/{id}', name: 'patient_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $patient = $this->patientRepository->find($id);

        if (!$patient || !$patient->isIsActive()) {
            return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
        }

        $patient->setIsActive(false);
        $this->em->flush();

        return $this->json(['message' => 'Patient deactivated']);
    }

    #[Route('/{id}/thresholds', name: 'patient_thresholds', methods: ['GET'])]
public function getThresholdsByPatient(int $id): JsonResponse
{
    $patient = $this->patientRepository->find($id);

    if (!$patient || !$patient->isIsActive()) {
        return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
    }

    $thresholds = array_filter(
        $patient->getSensorAlertThresholds()->toArray(),
        fn($t) => $t->isActive()
    );

    $response = array_map(function ($t) {
        return [
            'id' => $t->getId(),
            'parameter' => $t->getParameter(),
            'minValue' => $t->getMinValue(),
            'maxValue' => $t->getMaxValue(),
            'durationMinutes' => $t->getDurationMinutes(),
            'message' => $t->getMessage(),
            'isActive' => $t->isActive()
        ];
    }, $thresholds);

    return $this->json($response);
}

private function serializePatient(Patient $patient): array
{
    return [
        'id' => $patient->getId(),
        'email' => $patient->getEmail(),
        'phone' => $patient->getPhone(),
        'firstName' => $patient->getFirstName(),
        'lastName' => $patient->getLastName(),
        'cnp' => $patient->getCnp(),
        'occupation' => $patient->getOccupation(),
        'locality' => $patient->getLocality(),
        'street' => $patient->getStreet(),
        'number' => $patient->getNumber(),
        'block' => $patient->getBlock(),
        'staircase' => $patient->getStaircase(),
        'apartment' => $patient->getApartment(),
        'floor' => $patient->getFloor(),
        'bloodGroup' => $patient->getBloodGroup(),
        'rh' => $patient->getRh(),
        'weight' => $patient->getWeight(),
        'height' => $patient->getHeight(),
        'birthDate' => $patient->getBirthDate()?->format('Y-m-d'),
        'sex' => $patient->getSex(),
        'createdAt' => $patient->getCreatedAt()?->format('Y-m-d H:i:s'),
        'isActive' => $patient->isIsActive(),

        // 🔹 Alarms
        'alarms' => array_map(function ($alarm) {
            return [
                'id' => $alarm->getId(),
                'parameter' => $alarm->getParameter(),
                'condition' => $alarm->getConditionType(),
                'threshold' => $alarm->getThreshold(),
                'duration' => $alarm->getDuration(),
                'afterActivity' => $alarm->isAfterActivity(),
                'message' => $alarm->getMessage(),
            ];
        }, $patient->getAlarms()->toArray()),

        // 🔹 Allergies
        'allergies' => array_map(function ($a) {
            return [
                'id' => $a->getId(),
                'name' => $a->getName(),
                'severity' => $a->getSeverity(),
                'reaction' => $a->getReaction(),
                'notes' => $a->getNotes(),
                'recordedDate' => $a->getRecordedDate()?->format('Y-m-d'),
            ];
        }, $patient->getAllergies()->toArray()),

            // 🔹 Diseases
        'diseases' => array_map(function ($disease) {
        return [
            'id' => $disease->getId(),
            'name' => $disease->getName(),
            'type' => $disease->getType(),
            'description' => $disease->getDescription(),
        ];
    }, $patient->getDiseases()->toArray()),

            // 🔹 Medications
        'medications' => array_map(function ($med) {
          return [
            'id' => $med->getId(),
            'name' => $med->getName(),
            'dose' => $med->getDose(),
            'frequency' => $med->getFrequency(),
            'route' => $med->getRoute(),
            'startDate' => $med->getStartDate()?->format('Y-m-d'),
            'endDate' => $med->getEndDate()?->format('Y-m-d'),
            'prescribedBy' => $med->getPrescribedBy(),
            'notes' => $med->getNotes(),
            'createdAt' => $med->getCreatedAt()?->format('Y-m-d H:i:s'),
            'isActive' => $med->isIsActive(),
    ];
}, $patient->getMedications()->toArray()),

// 🔹 Consultations
'consultations' => array_map(function ($consultation) {
    return [
        'id' => $consultation->getId(),
        'dateTime' => $consultation->getDateTime()?->format('Y-m-d H:i:s'),
        'doctorName' => $consultation->getDoctorName(),
        'durationMinutes' => $consultation->getDurationMinutes(),
        'symptoms' => $consultation->getSymptoms(),
        'notes' => $consultation->getNotes(),
        'pulse' => $consultation->getPulse(),
        'bloodPressure' => $consultation->getBloodPressure(),
        'temperature' => $consultation->getTemperature(),
        'weightKg' => $consultation->getWeightKg(),
        'heightCm' => $consultation->getHeightCm(),
        'respiratoryRate' => $consultation->getRespiratoryRate(),
        'isActive' => $consultation->isActive(),
    ];
}, array_filter(
    $patient->getConsultations()->toArray(),
    fn($c) => $c->isActive()
)),
// 🔹 Referrals
'referrals' => array_map(function ($referral) {
    return [
        'id' => $referral->getId(),
        'type' => $referral->getType(),
        'fromDoctorId' => $referral->getFromDoctor()?->getId(),
        'toDoctorId' => $referral->getToDoctor()?->getId(),
        'reason' => $referral->getReason(),
        'date' => $referral->getDate()?->format('Y-m-d'),
        'hl7Payload' => $referral->getHl7Payload(),
        'fhirResponseId' => $referral->getFhirResponseId(),
        'isResolved' => $referral->isResolved(),
        'createdAt' => $referral->getCreatedAt()?->format('Y-m-d H:i:s'),
        'isActive' => $referral->isActive()
    ];
}, array_filter(
    $patient->getReferrals()->toArray(),
    fn($r) => $r->isActive()
)),
//Recommendations
'recommendations' => $patient->getRecommendations()->map(fn($r) => [
    'id' => $r->getId(),
    'activityType' => $r->getActivityType(),
    'dailyDuration' => $r->getDailyDuration(),
    'startDate' => $r->getStartDate()?->format('Y-m-d'),
    'endDate' => $r->getEndDate()?->format('Y-m-d'),
    'additionalNotes' => $r->getAdditionalNotes(),
    'isActive' => $r->isActive(),
])->toArray(),

//Thresholds
'sensorAlertThresholds' => array_map(function ($t) {
    return [
        'id' => $t->getId(),
        'parameter' => $t->getParameter(),
        'minValue' => $t->getMinValue(),
        'maxValue' => $t->getMaxValue(),
        'durationMinutes' => $t->getDurationMinutes(),
        'message' => $t->getMessage(),
        'isActive' => $t->isActive()
    ];
}, array_filter(
    $patient->getSensorAlertThresholds()->toArray(),
    fn($t) => $t->isActive()
)),

    ];

}
}