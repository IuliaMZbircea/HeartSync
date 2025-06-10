<?php

namespace App\Controller;

use App\Entity\Recommendation;
use App\Entity\Patient;
use App\Repository\RecommendationRepository;
use App\Repository\PatientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/custom-recommendations')]
class RecommendationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private RecommendationRepository $recommendationRepository,
        private PatientRepository $patientRepository
    ) {}

    #[Route('', name: 'recommendation_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $recommendations = $this->recommendationRepository->findAll();

        $response = array_map(function (Recommendation $recommendation) {
            return [
                'id' => $recommendation->getId(),
                'patientId' => $recommendation->getPatient()?->getId(),
                'activityType' => $recommendation->getActivityType(),
                'dailyDuration' => $recommendation->getDailyDuration(),
                'startDate' => $recommendation->getStartDate(),
                'endDate' => $recommendation->getEndDate(),
                'additionalNotes' => $recommendation->getAdditionalNotes(),
                'isActive' => $recommendation->isActive(),
                'hl7' => [
                    'resourceType' => 'ActivityDefinition',
                    'id' => $recommendation->getId(),
                    'status' => $recommendation->isActive() ? 'active' : 'inactive',
                    'subject' => [
                        'reference' => 'Patient/' . $recommendation->getPatient()?->getId(),
                    ],
                    'description' => $recommendation->getActivityType(),
                    'timingTiming' => [
                        'repeat' => [
                            'frequency' => 1,
                            'period' => $recommendation->getDailyDuration(),
                            'periodUnit' => 'd'
                        ]
                    ],
                    'effectivePeriod' => [
                        'start' => $recommendation->getStartDate()?->format('Y-m-d'),
                        'end' => $recommendation->getEndDate()?->format('Y-m-d')
                    ],
                    'text' => [
                        'status' => 'generated',
                        'div' => $recommendation->getAdditionalNotes() ?? ''
                    ]
                ]
            ];
        }, $recommendations);

        return $this->json($response);
    }

    #[Route('', name: 'recommendation_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['patient'])) {
            return $this->json(['error' => 'Invalid JSON or missing patient'], Response::HTTP_BAD_REQUEST);
        }

        $patient = $this->patientRepository->find($data['patient']);
        if (!$patient) {
            return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
        }

        $recommendation = new Recommendation();
        $recommendation->setPatient($patient);
        $recommendation->setActivityType($data['activityType'] ?? '');
        $recommendation->setDailyDuration((int)($data['dailyDuration'] ?? 0));
        $recommendation->setStartDate(new \DateTime($data['startDate'] ?? 'now'));

        if (!empty($data['endDate'])) {
            $recommendation->setEndDate(new \DateTime($data['endDate']));
        }

        $recommendation->setAdditionalNotes($data['additionalNotes'] ?? null);
        $recommendation->setIsActive($data['isActive'] ?? true);
        $recommendation->setCreatedAt(new \DateTime());

        $this->em->persist($recommendation);
        $this->em->flush();

        return $this->json([
            'recommendation' => $recommendation,
            'hl7' => [
                'resourceType' => 'ActivityDefinition',
                'id' => $recommendation->getId(),
                'status' => $recommendation->isActive() ? 'active' : 'inactive',
                'subject' => [
                    'reference' => 'Patient/' . $recommendation->getPatient()?->getId(),
                ],
                'description' => $recommendation->getActivityType(),
                'timingTiming' => [
                    'repeat' => [
                        'frequency' => 1,
                        'period' => $recommendation->getDailyDuration(),
                        'periodUnit' => 'd'
                    ]
                ],
                'effectivePeriod' => [
                    'start' => $recommendation->getStartDate()?->format('Y-m-d'),
                    'end' => $recommendation->getEndDate()?->format('Y-m-d')
                ],
                'text' => [
                    'status' => 'generated',
                    'div' => $recommendation->getAdditionalNotes() ?? ''
                ]
            ]
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'recommendation_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $recommendation = $this->recommendationRepository->find($id);

        if (!$recommendation || !$recommendation->isActive()) {
            return $this->json(['error' => 'Recommendation not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'recommendation' => $recommendation,
            'hl7' => [
                'resourceType' => 'ActivityDefinition',
                'id' => $recommendation->getId(),
                'status' => $recommendation->isActive() ? 'active' : 'inactive',
                'subject' => [
                    'reference' => 'Patient/' . $recommendation->getPatient()?->getId(),
                ],
                'description' => $recommendation->getActivityType(),
                'timingTiming' => [
                    'repeat' => [
                        'frequency' => 1,
                        'period' => $recommendation->getDailyDuration(),
                        'periodUnit' => 'd'
                    ]
                ],
                'effectivePeriod' => [
                    'start' => $recommendation->getStartDate()?->format('Y-m-d'),
                    'end' => $recommendation->getEndDate()?->format('Y-m-d')
                ],
                'text' => [
                    'status' => 'generated',
                    'div' => $recommendation->getAdditionalNotes() ?? ''
                ]
            ]
        ]);
    }

    #[Route('/{id}', name: 'recommendation_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $recommendation = $this->recommendationRepository->find($id);
        if (!$recommendation) {
            return $this->json(['error' => 'Recommendation not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['patient'])) {
            $patient = $this->patientRepository->find($data['patient']);
            if (!$patient) {
                return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
            }
            $recommendation->setPatient($patient);
        }

        if (isset($data['activityType'])) $recommendation->setActivityType($data['activityType']);
        if (isset($data['dailyDuration'])) $recommendation->setDailyDuration((int)$data['dailyDuration']);
        if (isset($data['startDate'])) $recommendation->setStartDate(new \DateTime($data['startDate']));
        if (isset($data['endDate'])) $recommendation->setEndDate(new \DateTime($data['endDate']));
        if (isset($data['additionalNotes'])) $recommendation->setAdditionalNotes($data['additionalNotes']);
        if (isset($data['isActive'])) $recommendation->setIsActive((bool)$data['isActive']);

        $this->em->flush();

        return $this->json([
            'recommendation' => $recommendation,
            'hl7' => [
                'resourceType' => 'ActivityDefinition',
                'id' => $recommendation->getId(),
                'status' => $recommendation->isActive() ? 'active' : 'inactive',
                'subject' => [
                    'reference' => 'Patient/' . $recommendation->getPatient()?->getId(),
                ],
                'description' => $recommendation->getActivityType(),
                'timingTiming' => [
                    'repeat' => [
                        'frequency' => 1,
                        'period' => $recommendation->getDailyDuration(),
                        'periodUnit' => 'd'
                    ]
                ],
                'effectivePeriod' => [
                    'start' => $recommendation->getStartDate()?->format('Y-m-d'),
                    'end' => $recommendation->getEndDate()?->format('Y-m-d')
                ],
                'text' => [
                    'status' => 'generated',
                    'div' => $recommendation->getAdditionalNotes() ?? ''
                ]
            ]
        ]);
    }

    #[Route('/{id}', name: 'recommendation_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $recommendation = $this->recommendationRepository->find($id);
        if (!$recommendation) {
            return $this->json(['error' => 'Recommendation not found'], Response::HTTP_NOT_FOUND);
        }

        $recommendation->setIsActive(false);
        $this->em->flush();

        return $this->json(['message' => 'Recommendation marked as inactive']);
    }
    #[Route('/patient_id/{id}', name: 'recommendations_by_patient', methods: ['GET'])]
public function getByPatient(int $id): JsonResponse
{
    $patient = $this->patientRepository->find($id);

    if (!$patient) {
        return $this->json(['error' => 'Patient not found'], Response::HTTP_NOT_FOUND);
    }

    $recommendations = $this->recommendationRepository->findBy(['patient' => $patient]);

    $response = array_map(function (Recommendation $r) {
        return [
            'id' => $r->getId(),
            'patientId' => $r->getPatient()?->getId(),
            'activityType' => $r->getActivityType(),
            'dailyDuration' => $r->getDailyDuration(),
            'startDate' => $r->getStartDate()?->format('Y-m-d'),
            'endDate' => $r->getEndDate()?->format('Y-m-d'),
            'additionalNotes' => $r->getAdditionalNotes(),
            'createdAt' => $r->getCreatedAt()?->format('Y-m-d H:i:s'),
            'isActive' => $r->isActive()
        ];
    }, $recommendations);

    return $this->json($response);
}

}