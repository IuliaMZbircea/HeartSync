<?php

namespace App\Entity;

use App\Repository\MedicalLetterRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\Entity\Referral;
use App\Entity\Patient;
use App\Entity\Doctor;
use App\Entity\Consultation;

#[ApiResource]
#[ORM\Entity(repositoryClass: MedicalLetterRepository::class)]
class MedicalLetter
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Referral::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    private ?Referral $referral = null;

    #[ORM\ManyToOne(targetEntity: Patient::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    private ?Patient $patient = null;

    #[ORM\ManyToOne(targetEntity: Doctor::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    private ?Doctor $fromSpecialist = null;

    #[ORM\ManyToOne(targetEntity: Doctor::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: "CASCADE")]
    private ?Doctor $toDoctor = null;

    #[ORM\ManyToOne(targetEntity: Consultation::class)]
    #[ORM\JoinColumn(nullable: true, onDelete: "SET NULL")]
    private ?Consultation $consultation = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $fhirPayload = null;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private ?bool $isActive = true;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    // Getters & Setters
    public function getId(): ?int { return $this->id; }

    public function getReferral(): ?Referral { return $this->referral; }
    public function setReferral(Referral $referral): self { $this->referral = $referral; return $this; }

    public function getPatient(): ?Patient { return $this->patient; }
    public function setPatient(Patient $patient): self { $this->patient = $patient; return $this; }

    public function getFromSpecialist(): ?Doctor { return $this->fromSpecialist; }
    public function setFromSpecialist(Doctor $fromSpecialist): self { $this->fromSpecialist = $fromSpecialist; return $this; }

    public function getToDoctor(): ?Doctor { return $this->toDoctor; }
    public function setToDoctor(Doctor $toDoctor): self { $this->toDoctor = $toDoctor; return $this; }

    public function getConsultation(): ?Consultation { return $this->consultation; }
    public function setConsultation(?Consultation $consultation): self { $this->consultation = $consultation; return $this; }

    public function getDate(): ?\DateTimeInterface { return $this->date; }
    public function setDate(\DateTimeInterface $date): self { $this->date = $date; return $this; }

    public function getFhirPayload(): ?string { return $this->fhirPayload; }
    public function setFhirPayload(string $fhirPayload): self { $this->fhirPayload = $fhirPayload; return $this; }

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
