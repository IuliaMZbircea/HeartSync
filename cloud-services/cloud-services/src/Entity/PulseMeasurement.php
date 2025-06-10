<?php

namespace App\Entity;

use App\Repository\PulseMeasurementRepository;
use App\Entity\Patient;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ORM\Entity(repositoryClass: PulseMeasurementRepository::class)]
#[ORM\Table(name: 'pulse_measurements')]
#[ApiResource]
class PulseMeasurement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Patient::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Patient $patient = null;

    #[ORM\Column(type: Types::INTEGER)]
    private ?int $pulse = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::BOOLEAN, options: ['default' => false])]
    private ?bool $sendAlarm = false;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->sendAlarm = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPatient(): ?Patient
    {
        return $this->patient;
    }

    public function setPatient(?Patient $patient): static
    {
        $this->patient = $patient;
        return $this;
    }

    public function getPulse(): ?int
    {
        return $this->pulse;
    }

    public function setPulse(int $pulse): static
    {
        $this->pulse = $pulse;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function isSendAlarm(): ?bool
    {
        return $this->sendAlarm;
    }

    public function setSendAlarm(bool $sendAlarm): static
    {
        $this->sendAlarm = $sendAlarm;
        return $this;
    }
}
