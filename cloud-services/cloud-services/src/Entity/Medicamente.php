<?php

namespace App\Entity;

use App\Repository\MedicamenteRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MedicamenteRepository::class)]
class Medicamente
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $nume = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $concentratie = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $forma_farmaceutica = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $descriere = null;

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

    public function getNume(): ?string
    {
        return $this->nume;
    }

    public function setNume(?string $nume): static
    {
        $this->nume = $nume;

        return $this;
    }

    public function getConcentratie(): ?string
    {
        return $this->concentratie;
    }

    public function setConcentratie(?string $concentratie): static
    {
        $this->concentratie = $concentratie;

        return $this;
    }

    public function getFormaFarmaceutica(): ?string
    {
        return $this->forma_farmaceutica;
    }

    public function setFormaFarmaceutica(?string $forma_farmaceutica): static
    {
        $this->forma_farmaceutica = $forma_farmaceutica;

        return $this;
    }

    public function getDescriere(): ?string
    {
        return $this->descriere;
    }

    public function setDescriere(?string $descriere): static
    {
        $this->descriere = $descriere;

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
