<?php

namespace App\Controller;

use App\Entity\Medication;
use App\Repository\MedicationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/medications')]
class MedicationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private MedicationRepository $medicationRepository
    ) {}

    #[Route('', name: 'medication_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $medications = $this->medicationRepository->findBy(['status' => true]);
        $hl7 = [];

        foreach ($medications as $medication) {
            $hl7[] = $this->toHL7($medication);
        }

        return $this->json($hl7);
    }

    #[Route('', name: 'medication_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $medication = new Medication();
        $medication->setName($data['name'] ?? '');
        $medication->setDose($data['dose'] ?? '');
        $medication->setFrequency($data['frequency'] ?? '');
        $medication->setRoute($data['route'] ?? '');
        $medication->setStartDate(isset($data['start_date']) ? new \DateTime($data['start_date']) : null);
        $medication->setEndDate(isset($data['end_date']) ? new \DateTime($data['end_date']) : null);
        $medication->setPrescribedBy($data['prescribed_by'] ?? '');
        $medication->setNotes($data['notes'] ?? null);
        $medication->setStatus(true);
        $medication->setCreatedAt(new \DateTime());

        $this->em->persist($medication);
        $this->em->flush();

        return $this->json($this->toHL7($medication), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'medication_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $medication = $this->medicationRepository->find($id);
        if (!$medication || !$medication->isStatus()) {
            return $this->json(['error' => 'Medication not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->toHL7($medication));
    }

    #[Route('/{id}', name: 'medication_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $medication = $this->medicationRepository->find($id);
        if (!$medication || !$medication->isStatus()) {
            return $this->json(['error' => 'Medication not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) $medication->setName($data['name']);
        if (isset($data['dose'])) $medication->setDose($data['dose']);
        if (isset($data['frequency'])) $medication->setFrequency($data['frequency']);
        if (isset($data['route'])) $medication->setRoute($data['route']);
        if (isset($data['start_date'])) $medication->setStartDate(new \DateTime($data['start_date']));
        if (isset($data['end_date'])) $medication->setEndDate(new \DateTime($data['end_date']));
        if (isset($data['prescribed_by'])) $medication->setPrescribedBy($data['prescribed_by']);
        if (array_key_exists('notes', $data)) $medication->setNotes($data['notes']);

        $this->em->flush();

        return $this->json($this->toHL7($medication));
    }

    #[Route('/{id}', name: 'medication_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $medication = $this->medicationRepository->find($id);
        if (!$medication || !$medication->isStatus()) {
            return $this->json(['error' => 'Medication not found'], Response::HTTP_NOT_FOUND);
        }

        $medication->setStatus(false);
        $this->em->flush();

        return $this->json(['message' => 'Medication marked as inactive']);
    }

    private function toHL7(Medication $medication): array
    {
        return [
            'resourceType' => 'MedicationRequest',
            'id' => $medication->getId(),
            'status' => $medication->isStatus() ? 'active' : 'inactive',
            'medicationCodeableConcept' => [
                'text' => $medication->getName()
            ],
            'dosageInstruction' => [[
                'text' => $medication->getDose() . ', ' . $medication->getFrequency()
            ]],
            'route' => [
                'text' => $medication->getRoute()
            ],
            'note' => [[
                'text' => $medication->getNotes()
            ]],
            'authoredOn' => $medication->getCreatedAt()?->format('Y-m-d'),
            'extension' => [[
                'url' => 'http://example.com/fhir/StructureDefinition/prescribedBy',
                'valueString' => $medication->getPrescribedBy()
            ]]
        ];
    }
}
