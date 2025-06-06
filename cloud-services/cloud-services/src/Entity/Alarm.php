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

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getParameter(): ?string
    {
        return $this->parameter;
    }

    public function setParameter(string $parameter): static
    {
        $this->parameter = $parameter;

        return $this;
    }

    public function getConditionType(): ?string
    {
        return $this->conditionType;
    }

    public function setConditionType(string $conditionType): static
    {
        $this->conditionType = $conditionType;

        return $this;
    }

    public function getThreshold(): ?float
    {
        return $this->threshold;
    }

    public function setThreshold(float $threshold): static
    {
        $this->threshold = $threshold;

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): static
    {
        $this->duration = $duration;

        return $this;
    }

    public function isAfterActivity(): ?bool
    {
        return $this->afterActivity;
    }

    public function setAfterActivity(bool $afterActivity): static
    {
        $this->afterActivity = $afterActivity;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(?string $message): static
    {
        $this->message = $message;

        return $this;
    }
}
