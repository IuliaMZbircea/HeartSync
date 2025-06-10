<?php

namespace App\Entity;

use App\Repository\AlarmRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;


#[ApiResource]
#[ORM\Entity(repositoryClass: AlarmRepository::class)]
class Alarm
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Patient::class, inversedBy: 'alarms')]
    #[ORM\JoinColumn(name: "patient_id", referencedColumnName: "id", nullable: false, onDelete: "CASCADE")]
    private ?Patient $patient = null;

    #[ORM\Column(length: 255)]
    private ?string $parameter = null;

    #[ORM\Column(length: 255)]
    private ?string $conditionType = null;

    #[ORM\Column(type: 'float')]
    private ?float $threshold = null;

    #[ORM\Column(type: 'integer')]
    private ?int $duration = null;

    #[ORM\Column(type: 'boolean')]
    private ?bool $afterActivity = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $message = null;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private ?bool $isActive = true;

    #[ORM\Column(type: 'datetime', options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->isActive = true;
    }
    public function getId(): ?int
    {
        return $this->id;
    }

     public function getPatient(): ?Patient
    {
        return $this->patient;
    }

    public function setPatient(?Patient $patient): self
    {
        $this->patient = $patient;
        return $this;
    }

    public function setParameter(string $parameter): static
    {
        $this->parameter = $parameter;
        return $this;
    }

    public function getParameter(): ?string
    {
        return $this->parameter;
    }

    public function setConditionType(string $conditionType): static
    {
        $this->conditionType = $conditionType;
        return $this;
    }

    public function getConditionType(): ?string
    {
        return $this->conditionType;
    }

    public function setThreshold(float $threshold): static
    {
        $this->threshold = $threshold;
        return $this;
    }

    public function getThreshold(): ?float
    {
        return $this->threshold;
    }

    public function setDuration(int $duration): static
    {
        $this->duration = $duration;
        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setAfterActivity(bool $afterActivity): static
    {
        $this->afterActivity = $afterActivity;
        return $this;
    }

    public function isAfterActivity(): ?bool
    {
        return $this->afterActivity;
    }

    public function setMessage(?string $message): static
    {
        $this->message = $message;
        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setIsActive(bool $isActive): static
    {
        $this->isActive = $isActive;
        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->isActive;
    }


    public function setCreatedAt(\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }
}