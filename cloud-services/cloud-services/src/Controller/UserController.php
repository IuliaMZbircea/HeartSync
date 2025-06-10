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
}
