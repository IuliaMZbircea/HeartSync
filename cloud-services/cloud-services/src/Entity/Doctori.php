<?php

namespace App\Entity;

use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\DoctoriRepository;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

class Doctori implements UserInterface, PasswordAuthenticatedUserInterface
{
    

    #[ORM\Column(type: "integer", unique: true, options: ["unsigned" => true])]
    #[ORM\GeneratedValue(strategy: "AUTO")]
    private ?int $id = null;

	#[ORM\Id]
    #[ORM\Column(length: 13)]
    private ?string $cnp = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $nume = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $prenume = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $specialitate = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $cod_parafa = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $unitate_medicala = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $telefon = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $parola = null;

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

    public function setCnp(string $cnp): static
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

    public function getSpecialitate(): ?string
    {
        return $this->specialitate;
    }

    public function setSpecialitate(?string $specialitate): static
    {
        $this->specialitate = $specialitate;

        return $this;
    }

    public function getCodParafa(): ?string
    {
        return $this->cod_parafa;
    }

    public function setCodParafa(?string $cod_parafa): static
    {
        $this->cod_parafa = $cod_parafa;

        return $this;
    }

    public function getUnitateMedicala(): ?string
    {
        return $this->unitate_medicala;
    }

    public function setUnitateMedicala(?string $unitate_medicala): static
    {
        $this->unitate_medicala = $unitate_medicala;

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

    public function getParola(): ?string
    {
        return $this->parola;
    }

    public function setParola(?string $parola): static
    {
        $this->parola = $parola;

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
	
public function getUserIdentifier(): string
{
    if (!$this->email) {
        throw new \LogicException('Doctor has no email set. Cannot identify user.');
    }

    return $this->email;
}

public function getPassword(): ?string
{
    return $this->parola;
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
 public function getRoles(): array
    {
        return ['ROLE_DOCTOR']; // direct, fără DB
    }
public function eraseCredentials():void
 {
}

}
