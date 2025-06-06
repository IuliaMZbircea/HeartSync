<?php

namespace App\Entity;

use App\Repository\PacientiRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PacientiRepository::class)]
class Pacienti
{
    
    #[ORM\Column(type: "integer", unique: true, nullable: false)]
    #[ORM\GeneratedValue(strategy: "AUTO")]
    private ?int $id = null;

	#[ORM\Id]
    #[ORM\Column(length: 13, nullable: true)]
    private ?string $cnp = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $nume = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $prenume = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTime $data_nasterii = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $adresa = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $telefon = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $email = null;

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

    public function getCnp(): ?string
    {
        return $this->cnp;
    }

    public function setCnp(?string $cnp): static
    {
        $this->cnp = $cnp;

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

    public function getPrenume(): ?string
    {
        return $this->prenume;
    }

    public function setPrenume(?string $prenume): static
    {
        $this->prenume = $prenume;

        return $this;
    }

    public function getDataNasterii(): ?\DateTime
    {
        return $this->data_nasterii;
    }

    public function setDataNasterii(?\DateTime $data_nasterii): static
    {
        $this->data_nasterii = $data_nasterii;

        return $this;
    }

    public function getAdresa(): ?string
    {
        return $this->adresa;
    }

    public function setAdresa(?string $adresa): static
    {
        $this->adresa = $adresa;

        return $this;
    }

    public function getTelefon(): ?string
    {
        return $this->telefon;
    }

    public function setTelefon(?string $telefon): static
    {
        $this->telefon = $telefon;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

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
