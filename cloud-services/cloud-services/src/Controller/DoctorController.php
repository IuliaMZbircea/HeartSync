<?php

namespace App\Controller;

use App\Entity\Doctor;
use App\Repository\DoctorRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/api/doctors')]
class DoctorController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private DoctorRepository $doctorRepository,
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    #[Route('', name: 'doctor_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $doctors = $this->doctorRepository->findBy(['status' => true]);

        $response = [
            '@context' => '/api/contexts/Doctor',
            '@id' => '/api/doctors',
            '@type' => 'Collection',
            'totalItems' => count($doctors),
            'member' => array_map(function (Doctor $doc) {
                return [
                    '@id' => '/api/doctors/' . $doc->getId(),
                    '@type' => 'Doctor',
                    'id' => $doc->getId(),
                    'email' => $doc->getEmail(),
                    'firstName' => $doc->getFirstName(),
                    'lastName' => $doc->getLastName(),
                    'specialization' => $doc->getSpecialization(),
                    'roles' => $doc->getRoles(),
                    'status' => $doc->getStatus(),
                    'createdAt' => $doc->getCreatedAt()?->format(DATE_ATOM),
                    'resetToken' => $doc->getResetToken(),
                    'resetTokenExpiresAt' => $doc->getResetTokenExpiresAt()?->format(DATE_ATOM)
                ];
            }, $doctors)
        ];

        return $this->json($response);
    }

    #[Route('', name: 'doctor_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (empty($data['email']) || empty($data['password']) || empty($data['first_name']) || empty($data['last_name']) || empty($data['specialization'])) {
            return $this->json(['error' => 'All fields are required: email, password, first_name, last_name, specialization'], 400);
        }

        $doctor = new Doctor();
        $doctor->setEmail($data['email']);
        $doctor->setPassword($this->passwordHasher->hashPassword($doctor, $data['password']));
        $doctor->setFirstName($data['first_name']);
        $doctor->setLastName($data['last_name']);
        $doctor->setSpecialization($data['specialization']);
        $doctor->setRoles(['ROLE_DOCTOR']);
        $doctor->setStatus(true);
        $doctor->setCreatedAt(new \DateTime());

        $this->em->persist($doctor);
        $this->em->flush();

        return $this->json([
            '@id' => '/api/doctors/' . $doctor->getId(),
            '@type' => 'Doctor',
            'id' => $doctor->getId(),
            'email' => $doctor->getEmail(),
            'firstName' => $doctor->getFirstName(),
            'lastName' => $doctor->getLastName(),
            'specialization' => $doctor->getSpecialization(),
            'roles' => $doctor->getRoles(),
            'status' => $doctor->getStatus(),
            'createdAt' => $doctor->getCreatedAt()?->format(DATE_ATOM),
            'hl7' => [
                'resourceType' => 'Practitioner',
                'id' => $doctor->getId(),
                'name' => [[
                    'family' => $doctor->getLastName(),
                    'given' => [$doctor->getFirstName()]
                ]],
                'qualification' => [[
                    'code' => ['text' => $doctor->getSpecialization()]
                ]]
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'doctor_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $doctor = $this->doctorRepository->find($id);
        if (!$doctor || !$doctor->getStatus()) {
            return $this->json(['error' => 'Doctor not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            '@id' => '/api/doctors/' . $doctor->getId(),
            '@type' => 'Doctor',
            'id' => $doctor->getId(),
            'email' => $doctor->getEmail(),
            'firstName' => $doctor->getFirstName(),
            'lastName' => $doctor->getLastName(),
            'specialization' => $doctor->getSpecialization(),
            'roles' => $doctor->getRoles(),
            'status' => $doctor->getStatus(),
            'createdAt' => $doctor->getCreatedAt()?->format(DATE_ATOM),
            'hl7' => [
                'resourceType' => 'Practitioner',
                'id' => $doctor->getId(),
                'name' => [[
                    'family' => $doctor->getLastName(),
                    'given' => [$doctor->getFirstName()]
                ]],
                'qualification' => [[
                    'code' => ['text' => $doctor->getSpecialization()]
                ]]
            ]
        ]);
    }

    #[Route('/{id}', name: 'doctor_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $doctor = $this->doctorRepository->find($id);
        if (!$doctor) {
            return $this->json(['error' => 'Doctor not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['email'])) $doctor->setEmail($data['email']);
        if (!empty($data['password'])) {
            $hashedPassword = $this->passwordHasher->hashPassword($doctor, $data['password']);
            $doctor->setPassword($hashedPassword);
        }
        if (isset($data['first_name'])) $doctor->setFirstName($data['first_name']);
        if (isset($data['last_name'])) $doctor->setLastName($data['last_name']);
        if (isset($data['specialization'])) $doctor->setSpecialization($data['specialization']);
        if (isset($data['roles']) && is_array($data['roles'])) {
            $doctor->setRoles($data['roles']);
        }
        if (isset($data['status'])) $doctor->setStatus((bool)$data['status']);

        $this->em->flush();

        return $this->json([
            '@id' => '/api/doctors/' . $doctor->getId(),
            '@type' => 'Doctor',
            'id' => $doctor->getId(),
            'email' => $doctor->getEmail(),
            'firstName' => $doctor->getFirstName(),
            'lastName' => $doctor->getLastName(),
            'specialization' => $doctor->getSpecialization(),
            'roles' => $doctor->getRoles(),
            'status' => $doctor->getStatus(),
            'createdAt' => $doctor->getCreatedAt()?->format(DATE_ATOM),
            'hl7' => [
                'resourceType' => 'Practitioner',
                'id' => $doctor->getId(),
                'name' => [[
                    'family' => $doctor->getLastName(),
                    'given' => [$doctor->getFirstName()]
                ]],
                'qualification' => [[
                    'code' => ['text' => $doctor->getSpecialization()]
                ]]
            ]
        ]);
    }

    #[Route('/{id}', name: 'doctor_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $doctor = $this->doctorRepository->find($id);
        if (!$doctor) {
            return $this->json(['error' => 'Doctor not found'], Response::HTTP_NOT_FOUND);
        }

        $doctor->setStatus(false);
        $this->em->flush();

        return $this->json(['message' => 'Doctor marked as inactive']);
    }
}
