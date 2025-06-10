<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SensorAlertThresholdRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: SensorAlertThresholdRepository::class)]
class SensorAlertThreshold
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Patient::class)]
    #[ORM\JoinColumn(name: "patient_id", referencedColumnName: "id", nullable: false, onDelete: "CASCADE")]
    private ?Patient $patient = null;

    #[ORM\Column(type: Types::STRING, length: 32)]
    private ?string $parameter = null;

    #[ORM\Column(type: Types::FLOAT)]
    private ?float $minValue = null;

    #[ORM\Column(type: Types::FLOAT)]
    private ?float $maxValue = null;

    #[ORM\Column(type: Types::INTEGER)]
    private ?int $durationMinutes = null;

    #[ORM\Column(type: Types::STRING, length: 255)]
    private ?string $message = null;

    #[ORM\Column(type: Types::BOOLEAN, options: ["default" => true])]
    private bool $isActive = true;

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

    public function getParameter(): ?string
    {
        return $this->parameter;
    }

    public function setParameter(string $parameter): self
    {
        $this->parameter = $parameter;
        return $this;
    }

    public function getMinValue(): ?float
    {
        return $this->minValue;
    }

    public function setMinValue(float $minValue): self
    {
        $this->minValue = $minValue;
        return $this;
    }

    public function getMaxValue(): ?float
    {
        return $this->maxValue;
    }

    public function setMaxValue(float $maxValue): self
    {
        $this->maxValue = $maxValue;
        return $this;
    }

    public function getDurationMinutes(): ?int
    {
        return $this->durationMinutes;
    }

    public function setDurationMinutes(int $durationMinutes): self
    {
        $this->durationMinutes = $durationMinutes;
        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): self
    {
        $this->message = $message;
        return $this;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): self
    {
        $this->isActive = $isActive;
        return $this;
    }
}
