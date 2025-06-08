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

#[Route('/api/doctors')]
class DoctorController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private DoctorRepository $doctorRepository
    ) {}

    #[Route('', name: 'doctor_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        return $this->json($this->doctorRepository->findAll());
    }

    #[Route('', name: 'doctor_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $doctor = new Doctor();
        $doctor->setEmail($data['email'] ?? '');
        $doctor->setPassword($data['password'] ?? '');
        $doctor->setFirstName($data['first_name'] ?? '');
        $doctor->setLastName($data['last_name'] ?? '');
        $doctor->setSpecialization($data['specialization'] ?? '');
        $doctor->setStatus($data['status'] ?? 'active');
        $doctor->setCreatedAt(new \DateTime());

        $this->em->persist($doctor);
        $this->em->flush();

        return $this->json($doctor, Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'doctor_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $doctor = $this->doctorRepository->find($id);

        if (!$doctor) {
            return $this->json(['error' => 'Doctor not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($doctor);
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
        if (isset($data['password'])) $doctor->setPassword($data['password']);
        if (isset($data['first_name'])) $doctor->setFirstName($data['first_name']);
        if (isset($data['last_name'])) $doctor->setLastName($data['last_name']);
        if (isset($data['specialization'])) $doctor->setSpecialization($data['specialization']);
        if (isset($data['status'])) $doctor->setStatus($data['status']);

        $this->em->flush();

        return $this->json($doctor);
    }

    #[Route('/{id}', name: 'doctor_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $doctor = $this->doctorRepository->find($id);

        if (!$doctor) {
            return $this->json(['error' => 'Doctor not found'], Response::HTTP_NOT_FOUND);
        }

        $this->em->remove($doctor);
        $this->em->flush();

        return $this->json(['message' => 'Doctor deleted']);
    }
}
