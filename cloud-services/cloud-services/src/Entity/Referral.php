<?php

namespace App\Entity;

use App\Repository\ReferralRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\Entity\Patient;
use App\Entity\Doctor;

#[ApiResource]
#[ORM\Entity(repositoryClass: ReferralRepository::class)]
class Referral
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $type = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Patient $patient = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Doctor $fromDoctor = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    private ?Doctor $toDoctor = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $reason = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $hl7Payload = null;

    #[ORM\Column(nullable: true)]
    private ?int $fhirResponseId = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    private ?bool $isResolved = false;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private ?bool $isActive = true;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    // Getters & Setters

    public function getId(): ?int { return $this->id; }

    public function getType(): ?string { return $this->type; }
    public function setType(string $type): self { $this->type = $type; return $this; }

    public function getPatient(): ?Patient { return $this->patient; }
    public function setPatient(?Patient $patient): self { $this->patient = $patient; return $this; }

    public function getFromDoctor(): ?Doctor { return $this->fromDoctor; }
    public function setFromDoctor(Doctor $fromDoctor): self { $this->fromDoctor = $fromDoctor; return $this; }

    public function getToDoctor(): ?Doctor { return $this->toDoctor; }
    public function setToDoctor(?Doctor $toDoctor): self { $this->toDoctor = $toDoctor; return $this; }

    public function getReason(): ?string { return $this->reason; }
    public function setReason(string $reason): self { $this->reason = $reason; return $this; }

    public function getDate(): ?\DateTimeInterface { return $this->date; }
    public function setDate(\DateTimeInterface $date): self { $this->date = $date; return $this; }

    public function getHl7Payload(): ?string { return $this->hl7Payload; }
    public function setHl7Payload(?string $hl7Payload): self { $this->hl7Payload = $hl7Payload; return $this; }

    public function getFhirResponseId(): ?int { return $this->fhirResponseId; }
    public function setFhirResponseId(?int $fhirResponseId): self { $this->fhirResponseId = $fhirResponseId; return $this; }

    public function isResolved(): ?bool { return $this->isResolved; }
    public function setIsResolved(bool $isResolved): self { $this->isResolved = $isResolved; return $this; }

public function setIsActive(bool $isActive): static
{
    $this->isActive = $isActive;
    return $this;
}

public function isActive(): ?bool
{
    return $this->isActive;
}

    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
    public function setCreatedAt(\DateTimeInterface $createdAt): self { $this->createdAt = $createdAt; return $this; }
}
