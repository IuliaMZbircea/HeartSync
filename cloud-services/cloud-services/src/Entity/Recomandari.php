<?php

namespace App\Entity;

use App\Repository\RecomandariRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Consultatii;

#[ORM\Entity(repositoryClass: RecomandariRepository::class)]

class Recomandari
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

     #[ORM\ManyToOne(targetEntity: Consultatii::class, inversedBy: "recomandari")]
    #[ORM\JoinColumn(name: "consultatie_id", referencedColumnName: "id", nullable: false, onDelete: "CASCADE")]
    private ?Consultatii $consultatie = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $tip = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $durata_zilnica = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $indicatii = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $created_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getConsultatieId(): ?Consultatii
    {
        return $this->consultatie_id;
    }

    public function setConsultatieId(?Consultatii $consultatie): static
    {
        $this->consultatie_id = $consultatie_id;

        return $this;
    }

    public function getTip(): ?string
    {
        return $this->tip;
    }

    public function setTip(?string $tip): static
    {
        $this->tip = $tip;

        return $this;
    }

    public function getDurataZilnica(): ?string
    {
        return $this->durata_zilnica;
    }

    public function setDurataZilnica(?string $durata_zilnica): static
    {
        $this->durata_zilnica = $durata_zilnica;

        return $this;
    }

    public function getIndicatii(): ?string
    {
        return $this->indicatii;
    }

    public function setIndicatii(?string $indicatii): static
    {
        $this->indicatii = $indicatii;

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
