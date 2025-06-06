<?php

namespace App\Controller;

use App\Entity\Doctori;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class RegistrationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher,
        private ValidatorInterface $validator,
        private JWTTokenManagerInterface $jwtManager
    ) {}

    #[Route('/api/register-doctor', name: 'api_register_doctor', methods: ['POST'])]
    public function registerDoctor(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $constraints = new Assert\Collection([
            'cnp' => [new Assert\NotBlank(), new Assert\Length(['min' => 13, 'max' => 13]), new Assert\Regex('/^\d+$/')],
            'nume' => [new Assert\NotBlank()],
            'prenume' => [new Assert\NotBlank()],
            'specialitate' => [new Assert\NotBlank()],
            'cod_parafa' => [new Assert\NotBlank()],
            'unitate_medicala' => [new Assert\NotBlank()],
            'telefon' => [new Assert\NotBlank()],
            'email' => [new Assert\NotBlank(), new Assert\Email()],
            'parola' => [new Assert\NotBlank(), new Assert\Length(['min' => 8])],
        ]);

        $violations = $this->validator->validate($data, $constraints);
        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $v) {
                $errors[] = $v->getPropertyPath() . ': ' . $v->getMessage();
            }
            return new JsonResponse(['errors' => $errors], 400);
        }

        if ($this->em->getRepository(Doctori::class)->find($data['cnp'])) {
            return new JsonResponse(['error' => 'Doctor already exists with this CNP'], 409);
        }

        $doctor = new Doctori();
        $doctor->setCnp($data['cnp']);
        $doctor->setNume($data['nume']);
        $doctor->setPrenume($data['prenume']);
        $doctor->setSpecialitate($data['specialitate']);
        $doctor->setCodParafa($data['cod_parafa']);
        $doctor->setUnitateMedicala($data['unitate_medicala']);
        $doctor->setTelefon($data['telefon']);
        $doctor->setEmail($data['email']);
        $doctor->setParola($this->passwordHasher->hashPassword($doctor, $data['parola']));
        $doctor->setCreatedAt(new \DateTime());

        $this->em->persist($doctor);
        $this->em->flush();

        return new JsonResponse(['message' => 'Doctor created'], 201);
    }

    #[Route('/api/login', name: 'api_login_manual', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $plainPassword = $data['parola'] ?? null;

        if (!$email || !$plainPassword) {
            return new JsonResponse(['error' => 'Email și parola sunt necesare'], 400);
        }

        $doctor = $this->em->getRepository(Doctori::class)->findOneBy(['email' => $email]);
        if (!$doctor || !$this->passwordHasher->isPasswordValid($doctor, $plainPassword)) {
            return new JsonResponse(['error' => 'Invalid credentials'], 401);
        }

        $token = $this->jwtManager->create($doctor);
        return new JsonResponse(['token' => $token], 200);
    }

    #[Route('/api/me', name: 'api_get_current_doctor', methods: ['GET'])]
    public function getMe(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof Doctori) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        return new JsonResponse([
            'cnp' => $user->getCnp(),
            'nume' => $user->getNume(),
            'prenume' => $user->getPrenume(),
            'email' => $user->getEmail(),
            'specialitate' => $user->getSpecialitate(),
            'unitate_medicala' => $user->getUnitateMedicala(),
            'telefon' => $user->getTelefon(),
            'roles' => $user->getRoles(),
        ]);
    }
}
