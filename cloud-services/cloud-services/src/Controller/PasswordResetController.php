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
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

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
        $expiresAt = (new \DateTime('+1 hour', new \DateTimeZone('Europe/Bucharest')));

        $doctor->setResetToken($token);
        $doctor->setResetTokenExpiresAt($expiresAt);
        $em->flush();

        $resetUrl = "http://localhost:4200/reset-password?token=$token";

        $emailMessage = (new Email())
            ->from(new Address('no-reply@heartsync.com', 'HeartSync Support'))
            ->to($doctor->getEmail())
            ->subject('Reset your HeartSync password')
            ->html("
                <h2>Password Reset Request</h2>
                <p>Hello <strong>{$doctor->getFirstName()}</strong>,</p>
                <p>We received a request to reset your password. Click the button below to continue:</p>
                <p>
                    <a href='$resetUrl' style='
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                    '>Reset Password</a>
                </p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <hr />
                <small>This link is valid for 1 hour. Do not share it with anyone.</small>
            ");

try {
    $mailer->send($emailMessage);
} catch (\Throwable $e) {
    return $this->json(['error' => 'Eroare la trimiterea emailului: ' . $e->getMessage()], 500);
}
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
