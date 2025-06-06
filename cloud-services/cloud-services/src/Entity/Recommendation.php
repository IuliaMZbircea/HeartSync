<?php

namespace App\Entity;

use App\Repository\RecommendationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;

#[ApiResource]
#[ORM\Entity(repositoryClass: RecommendationRepository::class)]
class Recommendation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

     #[ORM\Column(name: "activity_type", type: "string", length: 255)]
    private ?string $activity_type = null;

    #[ORM\Column(name: "daily_duration", type: "integer")]
    private ?int $daily_duration = null;

    #[ORM\Column(name: "start_date", type: "date")]
    private ?\DateTime $start_date = null;

    #[ORM\Column(name: "end_date", type: "date", nullable: true)]
    private ?\DateTime $end_date = null;

     #[ORM\Column(name: "additional_notes", type: "text", nullable: true)]
    private ?string $additional_notes = null;

    #[ORM\Column(name: "created_at", type: "datetime", nullable: true, options: ["default" => "CURRENT_TIMESTAMP"])]
    private ?\DateTime $created_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getActivityType(): ?string
    {
        return $this->activity_type;
    }

    public function setActivityType(string $activity_type): static
    {
        $this->activity_type = $activity_type;

        return $this;
    }

    public function getDailyDuration(): ?int
    {
        return $this->daily_duration;
    }

    public function setDailyDuration(int $daily_duration): static
    {
        $this->daily_duration = $daily_duration;

        return $this;
    }

    public function getStartDate(): ?\DateTime
    {
        return $this->start_date;
    }

    public function setStartDate(\DateTime $start_date): static
    {
        $this->start_date = $start_date;

        return $this;
    }

    public function getEndDate(): ?\DateTime
    {
        return $this->end_date;
    }

    public function setEndDate(?\DateTime $end_date): static
    {
        $this->end_date = $end_date;

        return $this;
    }

    public function getAdditionalNotes(): ?string
    {
        return $this->additional_notes;
    }

    public function setAdditionalNotes(?string $additional_notes): static
    {
        $this->additional_notes = $additional_notes;

        return $this;
    }

    public function getCreatedAt(): ?\DateTime
    {
        return $this->created_at;
    }

    public function setCreatedAt(?\DateTime $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }
}
