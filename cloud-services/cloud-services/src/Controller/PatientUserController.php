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
