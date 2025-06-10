<?php

namespace App\Controller;

use App\Entity\PatientUser;
use App\Repository\PatientRepository;
use App\Repository\PatientUserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/patient')]
class PatientRegistrationController extends AbstractController
{
    #[Route('/register', name: 'patient_user_register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        PatientRepository $patientRepo,
        PatientUserRepository $userRepo,
        UserPasswordHasherInterface $hasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
        $patientId = $data['patient_id'] ?? null;

        if (!$email || !$password || !$patientId) {
            return $this->json(['error' => 'Missing fields: email, password, patient_id'], 400);
        }

        if ($userRepo->findOneBy(['email' => $email])) {
            return $this->json(['error' => 'Email already in use'], 400);
        }

        if ($userRepo->findOneBy(['patient' => $patientId])) {
            return $this->json(['error' => 'This patient already has an account'], 400);
        }

        $patient = $patientRepo->find($patientId);

        if (!$patient) {
            return $this->json(['error' => 'Invalid patient_id'], 404);
        }

        $user = new PatientUser();
        $user->setEmail($email);
        $user->setPatient($patient);
        $user->setPassword($hasher->hashPassword($user, $password));

        $em->persist($user);
        $em->flush();

        return $this->json(['message' => 'Patient user created successfully'], 201);
    }
}
