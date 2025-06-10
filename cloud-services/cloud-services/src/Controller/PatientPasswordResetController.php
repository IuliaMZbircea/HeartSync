<?php

namespace App\Controller;

use App\Entity\PatientUser;
use App\Repository\PatientUserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api/patient')]
class PatientPasswordResetController extends AbstractController
{
    #[Route('/forgot-password', name: 'patient_forgot_password', methods: ['POST'])]
    public function forgotPassword(
        Request $request,
        EntityManagerInterface $em,
        PatientUserRepository $repo,
        MailerInterface $mailer
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;

        if (!$email) {
            return $this->json(['error' => 'Email is required'], 400);
        }

        $user = $repo->findOneBy(['email' => $email, 'isActive' => true]);

        // Securitate: răspuns generic chiar dacă nu există user (evită leak)
        if (!$user) {
            return $this->json(['message' => 'If the email exists, a reset link will be sent.'], 200);
        }

        // Generează token și expirare (ex: 1 oră)
        $token = bin2hex(random_bytes(32));
        $user->setResetToken($token);
        $user->setResetTokenExpiresAt((new \DateTime())->modify('+1 hour'));
        $em->flush();

        $resetLink = 'http://localhost:4200/reset-password/' . $token; // schimbă cu URL-ul frontend

        $mail = (new Email())
            ->from('no-reply@heartsync.com')
            ->to($user->getEmail())
            ->subject('Password Reset Request')
            ->text("To reset your password, click this link: $resetLink");

        $mailer->send($mail);

        return $this->json(['message' => 'If the email exists, a reset link will be sent.']);
    }

    #[Route('/reset-password/{token}', name: 'patient_reset_password', methods: ['POST'])]
    public function resetPassword(
        string $token,
        Request $request,
        PatientUserRepository $repo,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $password = $data['password'] ?? null;

        $user = $repo->findOneBy(['resetToken' => $token, 'isActive' => true]);

        if (
            !$user ||
            !$user->getResetTokenExpiresAt() ||
            $user->getResetTokenExpiresAt() < new \DateTime()
        ) {
            return $this->json(['error' => 'Invalid or expired token'], 400);
        }

        if (!$password) {
            return $this->json(['error' => 'Password is required'], 400);
        }

        $hashedPassword = $hasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);
        $user->setResetToken(null);
        $user->setResetTokenExpiresAt(null);
        $em->flush();

        return $this->json(['message' => 'Password reset successful']);
    }
}
