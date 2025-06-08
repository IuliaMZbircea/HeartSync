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
        return $this->json($this->patientRepository->findAll());
    }

    #[Route('', name: 'patient_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $patient = new Patient();
        $patient->setEmail($data['email']);
        $patient->setPhone($data['phone']);
        $patient->setFirstName($data['first_name']);
        $patient->setLastName($data['last_name']);
        $patient->setCnp($data['cnp']);
        $patient->setOccupation($data['occupation']);
        $patient->setLocality($data['locality']);
        $patient->setStreet($data['street']);
        $patient->setNumber($data['number']);
        $patient->setBlock($data['block'] ?? null);
        $patient->setStaircase($data['staircase'] ?? null);
        $patient->setApartment($data['apartment'] ?? null);
        $patient->setFloor($data['floor'] ?? null);
        $patient->setBloodGroup($data['blood_group']);
        $patient->setRh($data['rh']);
        $patient->setWeight($data['weight']);
        $patient->setHeight($data['height']);
        $patient->setValidAccount($data['valid_account'] ?? true);
        $patient->setBirthDate(new \DateTime($data['birth_date']));
        $patient->setSex($data['sex']);
        $patient->setPatientHistory($data['patient_history'] ?? []);
        $patient->setStatus('active');
        $patient->setCreatedAt(new \DateTime());

        $this->em->persist($patient);
        $this->em->flush();

        return $this->json($patient, Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'patient_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $patient = $this->patientRepository->find($id);

        if (!$patient) {
            return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($patient);
    }

    #[Route('/{id}', name: 'patient_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $patient = $this->patientRepository->find($id);
        if (!$patient) {
            return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        $patient->setPhone($data['phone'] ?? $patient->getPhone());
        $patient->setOccupation($data['occupation'] ?? $patient->getOccupation());
        // (continui la nevoie cu restul câmpurilor)

        $this->em->flush();
        return $this->json($patient);
    }

    #[Route('/{id}', name: 'patient_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $patient = $this->patientRepository->find($id);

        if (!$patient) {
            return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
        }

        $patient->setStatus('inactive');
        $this->em->flush();

        return $this->json(['message' => 'Patient deactivated']);
    }
}
