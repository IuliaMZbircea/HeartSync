<?php

namespace App\Entity;

use App\Repository\MedicationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ApiResource]
#[ORM\Entity(repositoryClass: MedicationRepository::class)]
class Medication
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $dose = null;

    #[ORM\Column(length: 255)]
    private ?string $frequency = null;

    #[ORM\Column(length: 255)]
    private ?string $route = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $start_date = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $end_date = null;

    #[ORM\Column(length: 255)]
    private ?string $prescribed_by = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $notes = null;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private ?bool $isActive = true;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $created_at = null;

    public function getId(): ?int { return $this->id; }

    public function getName(): ?string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }

    public function getDose(): ?string { return $this->dose; }
    public function setDose(string $dose): self { $this->dose = $dose; return $this; }

    public function getFrequency(): ?string { return $this->frequency; }
    public function setFrequency(string $frequency): self { $this->frequency = $frequency; return $this; }

    public function getRoute(): ?string { return $this->route; }
    public function setRoute(string $route): self { $this->route = $route; return $this; }

    public function getStartDate(): ?\DateTimeInterface { return $this->start_date; }
    public function setStartDate(?\DateTimeInterface $start_date): self { $this->start_date = $start_date; return $this; }

    public function getEndDate(): ?\DateTimeInterface { return $this->end_date; }
    public function setEndDate(?\DateTimeInterface $end_date): self { $this->end_date = $end_date; return $this; }

    public function getPrescribedBy(): ?string { return $this->prescribed_by; }
    public function setPrescribedBy(string $prescribed_by): self { $this->prescribed_by = $prescribed_by; return $this; }

    public function getNotes(): ?string { return $this->notes; }
    public function setNotes(?string $notes): self { $this->notes = $notes; return $this; }

public function setIsActive(bool $isActive): static
{
    $this->isActive = $isActive;
    return $this;
}

public function isActive(): ?bool
{
    return $this->isActive;
}


    public function getCreatedAt(): ?\DateTimeInterface { return $this->created_at; }
    public function setCreatedAt(?\DateTimeInterface $created_at): self { $this->created_at = $created_at; return $this; }
}
