<?php

namespace App\Controller;

use App\Entity\Doctor;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/api')]
class PasswordResetController extends AbstractController
{
    #[Route('/forgot-password', name: 'forgot_password', methods: ['POST'])]
    public function forgotPassword(Request $request, EntityManagerInterface $em, MailerInterface $mailer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;

        if (!$email) {
            return $this->json(['error' => 'Email is required'], 400);
        }

        $doctor = $em->getRepository(Doctor::class)->findOneBy(['email' => $email]);

        if (!$doctor) {
            return $this->json(['message' => 'If the email exists, a reset link will be sent.']);
        }

        $token = bin2hex(random_bytes(32));
        $expiresAt = new \DateTime('+1 hour');

        $doctor->setResetToken($token);
        $doctor->setResetTokenExpiresAt($expiresAt);
        $em->flush();

        $resetUrl = "https://frontend.heartsync.com/reset-password?token=$token"; // modifică dacă ai alt frontend

        $emailMessage = (new Email())
            ->from('no-reply@heartsync.com')
            ->to($doctor->getEmail())
            ->subject('Password Reset Request')
            ->text("Click the following link to reset your password: $resetUrl");

        $mailer->send($emailMessage);

        return $this->json(['message' => 'If the email exists, a reset link will be sent.']);
    }

    #[Route('/reset-password', name: 'reset_password', methods: ['POST'])]
    public function resetPassword(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $token = $data['token'] ?? null;
        $newPassword = $data['password'] ?? null;

        if (!$token || !$newPassword) {
            return $this->json(['error' => 'Token and new password are required'], 400);
        }

        $doctor = $em->getRepository(Doctor::class)->findOneBy(['resetToken' => $token]);

        if (!$doctor || $doctor->getResetTokenExpiresAt() < new \DateTime()) {
            return $this->json(['error' => 'Invalid or expired token'], 400);
        }

        $hashedPassword = $passwordHasher->hashPassword($doctor, $newPassword);
        $doctor->setPassword($hashedPassword);
        $doctor->setResetToken(null);
        $doctor->setResetTokenExpiresAt(null);

        $em->flush();

        return $this->json(['message' => 'Password successfully reset']);
    }
}
