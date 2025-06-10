<?php

namespace App\Controller;

use App\Entity\Medication;
use App\Entity\Patient;
use App\Repository\MedicationRepository;
use App\Repository\PatientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/custom-medications')]
class MedicationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private MedicationRepository $medicationRepository,
        private PatientRepository $patientRepository
    ) {}

    #[Route('', name: 'medication_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $medications = $this->medicationRepository->findAll();

        $hl7 = array_map(fn(Medication $m) => $this->toHL7($m), $medications);

        return $this->json($hl7);
    }

    #[Route('', name: 'medication_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['patient_id'])) {
            return $this->json(['error' => 'Invalid JSON or missing patient_id'], Response::HTTP_BAD_REQUEST);
        }

        $patient = $this->patientRepository->find($data['patient_id']);
        if (!$patient) {
            return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
        }

        $medication = new Medication();
        $medication->setName($data['name'] ?? '');
        $medication->setDose($data['dose'] ?? '');
        $medication->setFrequency($data['frequency'] ?? '');
        $medication->setRoute($data['route'] ?? '');
        $medication->setStartDate(isset($data['start_date']) ? new \DateTime($data['start_date']) : null);
        $medication->setEndDate(isset($data['end_date']) ? new \DateTime($data['end_date']) : null);
        $medication->setPrescribedBy($data['prescribed_by'] ?? '');
        $medication->setNotes($data['notes'] ?? null);
        $medication->setIsActive(true);
        $medication->setCreatedAt(new \DateTime());
        $medication->setPatient($patient);

        $this->em->persist($medication);
        $this->em->flush();

        return $this->json($this->toHL7($medication), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'medication_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $medication = $this->medicationRepository->find($id);
        if (!$medication || !$medication->isIsActive()) {
            return $this->json(['error' => 'Medication not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->toHL7($medication));
    }

    #[Route('/{id}', name: 'medication_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $medication = $this->medicationRepository->find($id);
        if (!$medication || !$medication->isIsActive()) {
            return $this->json(['error' => 'Medication not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) $medication->setName($data['name']);
        if (isset($data['dose'])) $medication->setDose($data['dose']);
        if (isset($data['frequency'])) $medication->setFrequency($data['frequency']);
        if (isset($data['route'])) $medication->setRoute($data['route']);
        if (isset($data['startDate'])) $medication->setStartDate(new \DateTime($data['startDate']));
        if (isset($data['endDate'])) $medication->setEndDate(new \DateTime($data['endDate']));
        if (array_key_exists('notes', $data)) $medication->setNotes($data['notes']);
        if (isset($data['patient_id'])) {
            $patient = $this->patientRepository->find($data['patient_id']);
            if ($patient) {
                $medication->setPatient($patient);
            }
        }

        $this->em->flush();

        return $this->json($this->toHL7($medication));
    }

    #[Route('/{id}', name: 'medication_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $medication = $this->medicationRepository->find($id);
        if (!$medication || !$medication->isIsActive()) {
            return $this->json(['error' => 'Medication not found'], Response::HTTP_NOT_FOUND);
        }

        $medication->setIsActive(false);
        $this->em->flush();

        return $this->json(['message' => 'Medication marked as inactive']);
    }

    #[Route('/patient_id/{id}', name: 'medications_by_patient', methods: ['GET'])]
public function getByPatient(int $id, PatientRepository $patientRepository): JsonResponse
{
    $patient = $patientRepository->find($id);

    if (!$patient) {
        return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
    }

    $medications = $this->medicationRepository->findBy(['patient' => $patient]);

    $response = array_map(function (Medication $med) {
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
    }, $medications);

    return $this->json($response);
}
    private function toHL7(Medication $medication): array
    {
        return [
            'resourceType' => 'MedicationRequest',
            'id' => $medication->getId(),
            'status' => $medication->isIsActive() ? 'active' : 'inactive',
            'prescribedBy' => $medication->getPrescribedBy(),
            'subject' => [
                'reference' => '/api/patients/' . $medication->getPatient()?->getId()
            ],
            'medicationCodeableConcept' => [
                'text' => $medication->getName()
            ],
            'dosageInstruction' => [[
                'text' => $medication->getDose() . ', ' . $medication->getFrequency()
            ]],
            'route' => [
                'text' => $medication->getRoute()
            ],
            'note' => [[
                'text' => $medication->getNotes()
            ]],
            'authoredOn' => $medication->getCreatedAt()?->format('Y-m-d'),
            'extension' => [[
                'url' => 'http://example.com/fhir/StructureDefinition/prescribedBy',
                'valueString' => $medication->getPrescribedBy()
            ]]
        ];
    }
}
