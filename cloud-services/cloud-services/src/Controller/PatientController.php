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


#[Route('/api/patients')]
class PatientController extends AbstractController
{

    public function __construct(
        private EntityManagerInterface $em,
        private PatientRepository $patientRepository
    ) {}

    #[Route('', name: 'patient_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $patients = $this->patientRepository->findBy(['isActive' => true]);
        $hl7 = array_map(fn(Patient $p) => $this->buildHl7($p), $patients);

        return $this->json($hl7);
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
        $patient->setFirstName($data['first_name'] ?? '');
        $patient->setLastName($data['last_name'] ?? '');
        $patient->setCnp($data['cnp'] ?? '');
        $patient->setOccupation($data['occupation'] ?? '');
        $patient->setLocality($data['locality'] ?? '');
        $patient->setStreet($data['street'] ?? '');
        $patient->setNumber($data['number'] ?? '');
        $patient->setBlock($data['block'] ?? null);
        $patient->setStaircase($data['staircase'] ?? null);
        $patient->setApartment($data['apartment'] ?? null);
        $patient->setFloor($data['floor'] ?? null);
        $patient->setBloodGroup($data['blood_group'] ?? '');
        $patient->setRh($data['rh'] ?? '');
        $patient->setWeight($data['weight'] ?? 0);
        $patient->setHeight($data['height'] ?? 0);
        $patient->setValidAccount($data['valid_account'] ?? true);
        $patient->setBirthDate(isset($data['birth_date']) ? new \DateTime($data['birth_date']) : null);
        $patient->setSex($data['sex'] ?? null);
        $patient->setPatientHistory($data['patient_history'] ?? []);
        $patient->setIsActive(true);
        $patient->setCreatedAt(new \DateTime());

        $this->em->persist($patient);
        $this->em->flush();

        return $this->json($this->buildHl7($patient), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'patient_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $patient = $this->patientRepository->find($id);
        if (!$patient || !$patient->isActive()) {
            return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->buildHl7($patient));
    }

    #[Route('/{id}', name: 'patient_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $patient = $this->patientRepository->find($id);
        if (!$patient || !$patient->isActive()) {
            return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $patient->setPhone($data['phone'] ?? $patient->getPhone());
        $patient->setOccupation($data['occupation'] ?? $patient->getOccupation());
        $patient->setWeight($data['weight'] ?? $patient->getWeight());
        $patient->setHeight($data['height'] ?? $patient->getHeight());
        $patient->setPatientHistory($data['patient_history'] ?? $patient->getPatientHistory());

        $this->em->flush();

        return $this->json($this->buildHl7($patient));
    }

    #[Route('/{id}', name: 'patient_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $patient = $this->patientRepository->find($id);
        if (!$patient || !$patient->isActive()) {
            return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
        }

        $patient->setIsActive(false);
        $this->em->flush();

        return $this->json(['message' => 'Patient deactivated']);
    }

    private function buildHl7(Patient $patient): array
    {
        return [
            'resourceType' => 'Patient',
            'id' => $patient->getId(),
            'meta' => [
                'versionId' => '1',
                'lastUpdated' => $patient->getCreatedAt()?->format(\DateTime::ATOM),
            ],
            'active' => $patient->isActive(),
            'name' => [[
                'family' => $patient->getLastName(),
                'given' => [$patient->getFirstName()]
            ]],
            'telecom' => [
                ['system' => 'phone', 'value' => $patient->getPhone(), 'use' => 'mobile'],
                ['system' => 'email', 'value' => $patient->getEmail(), 'use' => 'home']
            ],
            'gender' => match($patient->getSex()) {
                'M' => 'male',
                'F' => 'female',
                default => 'unknown'
            },
            'birthDate' => $patient->getBirthDate()?->format('Y-m-d'),
            'address' => [[
                'line' => [$patient->getStreet() . ' ' . $patient->getNumber()],
                'city' => $patient->getLocality()
            ]],
            'extension' => [
                ['url' => 'http://example.org/fhir/StructureDefinition/cnp', 'valueString' => $patient->getCnp()],
                ['url' => 'http://example.org/fhir/StructureDefinition/occupation', 'valueString' => $patient->getOccupation()],
                ['url' => 'http://example.org/fhir/StructureDefinition/height', 'valueDecimal' => $patient->getHeight()],
                ['url' => 'http://example.org/fhir/StructureDefinition/weight', 'valueDecimal' => $patient->getWeight()],
            ]
        ];
    }
}
