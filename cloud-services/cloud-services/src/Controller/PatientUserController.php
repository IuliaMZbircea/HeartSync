<?php

namespace App\Controller;

use App\Entity\PatientUser;
use App\Repository\PatientUserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/api/patient-user')]
class PatientUserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private PatientUserRepository $patientUserRepo,
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    #[Route('/me', name: 'patient_user_self', methods: ['GET'])]
    public function getMyProfile(): JsonResponse
    {
        /** @var PatientUser $user */
        $user = $this->getUser();

        if (!$user instanceof PatientUser) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $patient = $user->getPatient();

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i:s'),
            'patientId' => $patient?->getId(),
            'isActive' => $user->isActive(),
        ]);
    }

    #[Route('', name: 'patient_user_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'], $data['password'], $data['patient_id'])) {
            return $this->json(['error' => 'email, password and patient_id are required'], 400);
        }

        $existing = $this->patientUserRepo->findOneBy(['email' => $data['email']]);
        if ($existing) {
            return $this->json(['error' => 'Email already exists'], 409);
        }

        $patient = $this->em->getRepository(\App\Entity\Patient::class)->find($data['patient_id']);
        if (!$patient) {
            return $this->json(['error' => 'Invalid patient ID'], 404);
        }

        $user = new PatientUser();
        $user->setEmail($data['email']);
        $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        $user->setPatient($patient);

        $this->em->persist($user);
        $this->em->flush();

        return $this->json(['message' => 'Account created'], 201);
    }

    #[Route('/{id}', name: 'patient_user_delete', methods: ['DELETE'])]
    public function softDelete(int $id): JsonResponse
    {
        $user = $this->patientUserRepo->find($id);
        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        $user->setIsActive(false);
        $this->em->flush();

        return $this->json(['message' => 'Account deactivated']);
    }
}
