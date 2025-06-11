<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/user')]
class UserController extends AbstractController
{
    #[Route('/change-password', name: 'user_change_password', methods: ['POST'])]
    #[IsGranted('ROLE_PATIENT')]
    public function changePassword(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher,
        UserRepository $userRepo
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $newPassword = $data['new_password'] ?? null;

        if (!$newPassword) {
            return new JsonResponse(['error' => 'Missing new password'], 400);
        }

        /** @var User $user */
        $user = $this->getUser();
        $hashed = $hasher->hashPassword($user, $newPassword);
        $user->setPassword($hashed);
        $em->flush();

        return new JsonResponse(['message' => 'Password changed successfully']);
    }

    #[Route('/register', name: 'user_register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $hasher ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
        $patientId = $data['patientId'] ?? null;

        if (!$email || !$password) {
            return new JsonResponse(['error' => 'Email and password are required'], 400);
        }

        $existing = $em->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existing) {
            return new JsonResponse(['error' => 'Email already registered'], 409);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setPassword($hasher->hashPassword($user, $password));
        $user->setRoles(['ROLE_PATIENT']);
        $user->setIsActive(true);
        $user->setPatientId($patientId);
        $user->setCreatedAt(new \DateTime('now', new \DateTimeZone('Europe/Bucharest')));


        $em->persist($user);
        $em->flush();

        return new JsonResponse(['message' => 'User registered successfully'], 201);
}
    #[Route('/login', name: 'user_login', methods: ['POST'])]
    public function login(
    Request $request,
    UserRepository $userRepository,
    UserPasswordHasherInterface $passwordHasher,
    \Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface $jwtManager
): JsonResponse {
    $data = json_decode($request->getContent(), true);

    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;

    if (!$email || !$password) {
        return new JsonResponse(['error' => 'Email and password are required'], 400);
    }

    $user = $userRepository->findOneBy(['email' => $email]);
    if (!$user) {
        return new JsonResponse(['error' => 'Invalid credentials'], 401);
    }

    if (!$passwordHasher->isPasswordValid($user, $password)) {
        return new JsonResponse(['error' => 'Invalid credentials'], 401);
    }

    $token = $jwtManager->create($user);

    return new JsonResponse([
        'token' => $token,
        'user' => [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ]
    ]);
}

}
