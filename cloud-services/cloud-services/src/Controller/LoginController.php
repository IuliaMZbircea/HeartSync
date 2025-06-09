<?php

namespace App\Controller;

use App\Entity\Doctor;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class LoginController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private JWTTokenManagerInterface $jwtManager,
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    { 
        $data = json_decode($request->getContent(), true);
        if (!$data || empty($data['email']) || empty($data['password'])) {
            return $this->json(['error' => 'Email and password are required'], 400);
        }

        $doctor = $this->em->getRepository(Doctor::class)->findOneBy(['email' => $data['email']]);

        if (!$doctor || !$doctor->isActive()) {
            return $this->json(['error' => 'Invalid credentials or inactive account'], 401);
        }

        if (!$this->passwordHasher->isPasswordValid($doctor, $data['password'])) {
            return $this->json(['error' => 'Invalid credentials'], 401);
        }

        $token = $this->jwtManager->create($doctor);

        return $this->json([
            'token' => $token,
            'doctor' => [
                'id' => $doctor->getId(),
                'email' => $doctor->getEmail(),
                'firstName' => $doctor->getFirstName(),
                'lastName' => $doctor->getLastName(),
                'roles' => $doctor->getRoles(),
            ]
        ]);
    }
}
