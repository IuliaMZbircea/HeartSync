<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\AllergyRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: AllergyRepository::class)]
#[ORM\Table(name: 'allergy')]
class Allergy
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $name = null;

    #[ORM\Column(type: Types::STRING, length: 100, nullable: true)]
    private ?string $severity = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $reaction = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $notes = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $recordedDate = null;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private ?bool $status = true;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $createdAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getSeverity(): ?string
    {
        return $this->severity;
    }

    public function setSeverity(?string $severity): static
    {
        $this->severity = $severity;
        return $this;
    }

    public function getReaction(): ?string
    {
        return $this->reaction;
    }

    public function setReaction(?string $reaction): static
    {
        $this->reaction = $reaction;
        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): static
    {
        $this->notes = $notes;
        return $this;
    }

    public function getRecordedDate(): ?\DateTimeInterface
    {
        return $this->recordedDate;
    }

    public function setRecordedDate(?\DateTimeInterface $recordedDate): static
    {
        $this->recordedDate = $recordedDate;
        return $this;
    }

    public function getStatus(): ?bool
    {
        return $this->status;
    }

    public function setStatus(bool $status): static
    {
        $this->status = $status;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }
}
