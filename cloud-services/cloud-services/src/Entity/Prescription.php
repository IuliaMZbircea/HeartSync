<?php

namespace App\Entity;

use App\Repository\PrescriptionRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ApiResource]
#[ORM\Entity(repositoryClass: PrescriptionRepository::class)]
class Prescription
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $medicationName = null;

    #[ORM\Column(length: 100)]
    private ?string $dose = null;

    #[ORM\Column(length: 100)]
    private ?string $frequency = null;

    #[ORM\Column(length: 100)]
    private ?string $duration = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $issuedDate = null;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private ?bool $isActive = true;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    // Getters & Setters

    public function getId(): ?int { return $this->id; }

    public function getMedicationName(): ?string { return $this->medicationName; }
    public function setMedicationName(string $medicationName): self { $this->medicationName = $medicationName; return $this; }

    public function getDose(): ?string { return $this->dose; }
    public function setDose(string $dose): self { $this->dose = $dose; return $this; }

    public function getFrequency(): ?string { return $this->frequency; }
    public function setFrequency(string $frequency): self { $this->frequency = $frequency; return $this; }

    public function getDuration(): ?string { return $this->duration; }
    public function setDuration(string $duration): self { $this->duration = $duration; return $this; }

    public function getIssuedDate(): ?\DateTimeInterface { return $this->issuedDate; }
    public function setIssuedDate(\DateTimeInterface $issuedDate): self { $this->issuedDate = $issuedDate; return $this; }

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
