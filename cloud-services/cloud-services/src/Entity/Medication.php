<?php

namespace App\Entity;

use App\Repository\MedicationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(normalizationContext: ['groups' => ['medication']])]
#[ORM\Entity(repositoryClass: MedicationRepository::class)]
class Medication
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['medication'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['medication'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['medication'])]
    private ?string $dose = null;

    #[ORM\Column(length: 255)]
    #[Groups(['medication'])]
    private ?string $frequency = null;

    #[ORM\Column(length: 255)]
    #[Groups(['medication'])]
    private ?string $route = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['medication'])]
    private ?\DateTimeInterface $startDate = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['medication'])]
    private ?\DateTimeInterface $endDate = null;

    #[ORM\Column(length: 255)]
    #[Groups(['medication'])]
    private ?string $prescribedBy = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['medication'])]
    private ?string $notes = null;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    #[Groups(['medication'])]
    private ?bool $isActive = true;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups(['medication'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'medications')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['medication'])]
    private ?Patient $patient = null;

    // Getters și Setters
    public function getId(): ?int { return $this->id; }

    public function getName(): ?string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }

    public function getDose(): ?string { return $this->dose; }
    public function setDose(string $dose): self { $this->dose = $dose; return $this; }

    public function getFrequency(): ?string { return $this->frequency; }
    public function setFrequency(string $frequency): self { $this->frequency = $frequency; return $this; }

    public function getRoute(): ?string { return $this->route; }
    public function setRoute(string $route): self { $this->route = $route; return $this; }

    public function getStartDate(): ?\DateTimeInterface { return $this->startDate; }
    public function setStartDate(?\DateTimeInterface $startDate): self { $this->startDate = $startDate; return $this; }

    public function getEndDate(): ?\DateTimeInterface { return $this->endDate; }
    public function setEndDate(?\DateTimeInterface $endDate): self { $this->endDate = $endDate; return $this; }

    public function getPrescribedBy(): ?string { return $this->prescribedBy; }
    public function setPrescribedBy(string $prescribedBy): self { $this->prescribedBy = $prescribedBy; return $this; }

    public function getNotes(): ?string { return $this->notes; }
    public function setNotes(?string $notes): self { $this->notes = $notes; return $this; }

    public function isIsActive(): ?bool { return $this->isActive; }
    public function setIsActive(bool $isActive): self { $this->isActive = $isActive; return $this; }

    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
    public function setCreatedAt(?\DateTimeInterface $createdAt): self { $this->createdAt = $createdAt; return $this; }

    public function getPatient(): ?Patient { return $this->patient; }
    public function setPatient(?Patient $patient): self { $this->patient = $patient; return $this; }
}