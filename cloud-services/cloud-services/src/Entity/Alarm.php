<?php

namespace App\Entity;

use App\Repository\AlarmRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AlarmRepository::class)]
class Alarm
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $parameter = null;

    #[ORM\Column(length: 255)]
    private ?string $state = null;

    #[ORM\Column]
    private ?float $threshold = null;

    #[ORM\Column]
    private ?int $duration = null;

    #[ORM\Column(nullable: true)]
    private ?bool $afterActivity = null;

    #[ORM\Column(length: 255)]
    private ?string $message = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(string $state): static
    {
        $this->state = $state;

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

    public function setAfterActivity(?bool $afterActivity): static
    {
        $this->afterActivity = $afterActivity;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): static
    {
        $this->message = $message;

        return $this;
    }
}
