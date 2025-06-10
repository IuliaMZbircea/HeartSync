<?php

namespace App\Controller;

use App\Entity\Doctor;
use App\Repository\DoctorRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Security;

class DoctorController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private DoctorRepository $doctorRepository,
        private UserPasswordHasherInterface $passwordHasher,
        private JWTTokenManagerInterface $jwtManager
    ) {}

    #[Route('/custom-doctors', name: 'doctor_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $doctors = $this->doctorRepository->findAll();

        $response = [
            '@context' => '/api/contexts/Doctor',
            '@id' => '/api/doctors',
            '@type' => 'Collection',
            'totalItems' => count($doctors),
            'member' => array_map(function (Doctor $doc) {
                return [
                    '@id' => '/api/doctors/' . $doc->getId(),
                    '@type' => 'Doctor',
                    'id' => $doc->getId(),
                    'email' => $doc->getEmail(),
                    'firstName' => $doc->getFirstName(),
                    'lastName' => $doc->getLastName(),
                    'roles' => $doc->getRoles(),
                    'isActive' => $doc->isActive(),
                    'createdAt' => $doc->getCreatedAt()?->format(DATE_ATOM),
                    'resetToken' => $doc->getResetToken(),
                    'resetTokenExpiresAt' => $doc->getResetTokenExpiresAt()?->format(DATE_ATOM)
                ];
            }, $doctors)
        ];

        return $this->json($response);
    }

    #[Route('/doctors', name: 'doctor_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (empty($data['email']) || empty($data['password']) || empty($data['first_name']) || empty($data['last_name']) ) {
            return $this->json(['error' => 'All fields are required: email, password, first_name, last_name'], 400);
        }

        $doctor = new Doctor();
        $doctor->setEmail($data['email']);
        $doctor->setPassword($this->passwordHasher->hashPassword($doctor, $data['password']));
        $doctor->setFirstName($data['first_name']);
        $doctor->setLastName($data['last_name']);
        $doctor->setRoles(['ROLE_DOCTOR']);
        $doctor->setIsActive(true);
        $doctor->setCreatedAt(new \DateTime());

        $this->em->persist($doctor);
        $this->em->flush();

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

    #[Route('/api/doctors/{id}', name: 'doctor_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $doctor = $this->doctorRepository->find($id);
        if (!$doctor || !$doctor->isActive()) {
            return $this->json(['error' => 'Doctor not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            '@id' => '/api/doctors/' . $doctor->getId(),
            '@type' => 'Doctor',
            'id' => $doctor->getId(),
            'email' => $doctor->getEmail(),
            'firstName' => $doctor->getFirstName(),
            'lastName' => $doctor->getLastName(),
            'roles' => $doctor->getRoles(),
            'isActive' => $doctor->isActive(),
            'createdAt' => $doctor->getCreatedAt()?->format(DATE_ATOM),
            'hl7' => [
                'resourceType' => 'Practitioner',
                'id' => $doctor->getId(),
                'name' => [[
                    'family' => $doctor->getLastName(),
                    'given' => [$doctor->getFirstName()]
                ]],
            ]
        ]);
    }

    #[Route('/api/doctors/{id}', name: 'doctor_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $doctor = $this->doctorRepository->find($id);
        if (!$doctor) {
            return $this->json(['error' => 'Doctor not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['email'])) $doctor->setEmail($data['email']);
        if (!empty($data['password'])) {
            $hashedPassword = $this->passwordHasher->hashPassword($doctor, $data['password']);
            $doctor->setPassword($hashedPassword);
        }
        if (isset($data['first_name'])) $doctor->setFirstName($data['first_name']);
        if (isset($data['last_name'])) $doctor->setLastName($data['last_name']);
        if (isset($data['roles']) && is_array($data['roles'])) {
            $doctor->setRoles($data['roles']);
        }
        if (isset($data['isActive'])) $doctor->setIsActive((bool)$data['isActive']);

        $this->em->flush();

        return $this->json([
            '@id' => '/api/doctors/' . $doctor->getId(),
            '@type' => 'Doctor',
            'id' => $doctor->getId(),
            'email' => $doctor->getEmail(),
            'firstName' => $doctor->getFirstName(),
            'lastName' => $doctor->getLastName(),
            'roles' => $doctor->getRoles(),
            'isActive' => $doctor->isActive(),
            'createdAt' => $doctor->getCreatedAt()?->format(DATE_ATOM),
            'hl7' => [
                'resourceType' => 'Practitioner',
                'id' => $doctor->getId(),
                'name' => [[
                    'family' => $doctor->getLastName(),
                    'given' => [$doctor->getFirstName()]
                ]],
            ]
        ]);
    }

 #[Route('/api/doctors/{id}/deactivate', name: 'doctor_deactivate', methods: ['PATCH'])]
public function deactivate(int $id): JsonResponse
{
    if (!$this->isGranted('ROLE_ADMIN')) {
        return $this->json(['error' => 'Nu ai permisiunea să dezactivezi doctori.'], Response::HTTP_FORBIDDEN);
    }

    $doctor = $this->doctorRepository->find($id);
    if (!$doctor) {
        return $this->json(['error' => 'Doctorul nu a fost găsit.'], Response::HTTP_NOT_FOUND);
    }

    $doctor->setIsActive(false);
    $this->em->flush();

    return $this->json(['message' => 'Doctorul a fost dezactivat cu succes.']);
}

#[Route('api/doctors/auth/user', name: 'api_get_auth_user', methods: ['GET'])]
    public function getAuthUserDetails(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof Doctor) {
            return new JsonResponse(['error' => 'Unauthorized - No authenticated user'], 401);
        }

        if (in_array('ROLE_DOCTOR', $user->getRoles())) {
            return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
        ]);
    }else  {
            return new JsonResponse([
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ]);
        }
    }

}
