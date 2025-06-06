<?php

namespace App\Controller;

use App\Entity\Doctori;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class AuthController extends AbstractController
{
    #[Route('/api/register-doctor', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $hasher, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $plainPassword = $data['parola'] ?? null;

        if (!$email || !$plainPassword) {
            return $this->json(['error' => 'Email și parola sunt obligatorii'], 400);
        }

        $doctor = new Doctori();
        $doctor->setEmail($email);
        $doctor->setRoles(['ROLE_DOCTOR']);

        $hashedPassword = $hasher->hashPassword($doctor, $plainPassword);
        $doctor->setParola($hashedPassword);

        $em->persist($doctor);
        $em->flush();

        return $this->json(['status' => 'Doctor înregistrat cu succes']);
    }

    #[Route('/api/me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        return $this->json($this->getUser());
    }
}
