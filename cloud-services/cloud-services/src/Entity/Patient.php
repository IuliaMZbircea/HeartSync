<?php

namespace App\Entity;

use App\Repository\PatientRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Entity\Alarm;

#[ApiResource]
#[ORM\Entity(repositoryClass: PatientRepository::class)]
class Patient
{
    #[ORM\OneToMany(mappedBy: 'patient', targetEntity: Alarm::class, orphanRemoval: true)]
    private Collection $alarms;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $email = null;

    #[ORM\Column(length: 50)]
    private ?string $phone = null;

    #[ORM\Column(length: 100)]
    private ?string $first_name = null;

    #[ORM\Column(length: 100)]
    private ?string $last_name = null;

    #[ORM\Column(length: 13, unique: true)]
    private ?string $cnp = null;

    #[ORM\Column(length: 100)]
    private ?string $occupation = null;

    #[ORM\Column(length: 100)]
    private ?string $locality = null;

    #[ORM\Column(length: 100)]
    private ?string $street = null;

    #[ORM\Column(length: 10)]
    private ?string $number = null;

    #[ORM\Column(length: 10, nullable: true)]
    private ?string $block = null;

    #[ORM\Column(length: 10, nullable: true)]
    private ?string $staircase = null;

    #[ORM\Column(nullable: true)]
    private ?int $apartment = null;

    #[ORM\Column(nullable: true)]
    private ?int $floor = null;

    #[ORM\Column(length: 3)]
    private ?string $blood_group = null;

    #[ORM\Column(length: 3)]
    private ?string $rh = null;

    #[ORM\Column]
    private ?float $weight = null;

    #[ORM\Column]
    private ?float $height = null;

    #[ORM\Column(options: ["default" => true])]
    private ?bool $valid_account = true;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $birth_date = null;

    #[ORM\Column(length: 1, nullable: true)]
    private ?string $sex = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $patient_history = null;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private ?bool $isActive = true;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $created_at = null;

    // Getters & Setters

    public function getId(): ?int { return $this->id; }

    public function getEmail(): ?string { return $this->email; }
    public function setEmail(string $email): self { $this->email = $email; return $this; }

    public function getPhone(): ?string { return $this->phone; }
    public function setPhone(string $phone): self { $this->phone = $phone; return $this; }

    public function getFirstName(): ?string { return $this->first_name; }
    public function setFirstName(string $first_name): self { $this->first_name = $first_name; return $this; }

    public function getLastName(): ?string { return $this->last_name; }
    public function setLastName(string $last_name): self { $this->last_name = $last_name; return $this; }

    public function getCnp(): ?string { return $this->cnp; }
    public function setCnp(string $cnp): self { $this->cnp = $cnp; return $this; }

    public function getOccupation(): ?string { return $this->occupation; }
    public function setOccupation(string $occupation): self { $this->occupation = $occupation; return $this; }

    public function getLocality(): ?string { return $this->locality; }
    public function setLocality(string $locality): self { $this->locality = $locality; return $this; }

    public function getStreet(): ?string { return $this->street; }
    public function setStreet(string $street): self { $this->street = $street; return $this; }

    public function getNumber(): ?string { return $this->number; }
    public function setNumber(string $number): self { $this->number = $number; return $this; }

    public function getBlock(): ?string { return $this->block; }
    public function setBlock(?string $block): self { $this->block = $block; return $this; }

    public function getStaircase(): ?string { return $this->staircase; }
    public function setStaircase(?string $staircase): self { $this->staircase = $staircase; return $this; }

    public function getApartment(): ?int { return $this->apartment; }
    public function setApartment(?int $apartment): self { $this->apartment = $apartment; return $this; }

    public function getFloor(): ?int { return $this->floor; }
    public function setFloor(?int $floor): self { $this->floor = $floor; return $this; }

    public function getBloodGroup(): ?string { return $this->blood_group; }
    public function setBloodGroup(string $blood_group): self { $this->blood_group = $blood_group; return $this; }

    public function getRh(): ?string { return $this->rh; }
    public function setRh(string $rh): self { $this->rh = $rh; return $this; }

    public function getWeight(): ?float { return $this->weight; }
    public function setWeight(float $weight): self { $this->weight = $weight; return $this; }

    public function getHeight(): ?float { return $this->height; }
    public function setHeight(float $height): self { $this->height = $height; return $this; }

    public function isValidAccount(): ?bool { return $this->valid_account; }
    public function setValidAccount(bool $valid_account): self { $this->valid_account = $valid_account; return $this; }

    public function getBirthDate(): ?\DateTimeInterface { return $this->birth_date; }
    public function setBirthDate(?\DateTimeInterface $birth_date): self { $this->birth_date = $birth_date; return $this; }

    public function getSex(): ?string { return $this->sex; }
    public function setSex(?string $sex): self { $this->sex = $sex; return $this; }

    public function getPatientHistory(): ?array { return $this->patient_history; }
    public function setPatientHistory(?array $patient_history): self { $this->patient_history = $patient_history; return $this; }

public function setIsActive(bool $isActive): static
{
    $this->isActive = $isActive;
    return $this;
}

public function isActive(): ?bool
{
    return $this->isActive;
}

    public function getCreatedAt(): ?\DateTimeInterface { return $this->created_at; }
    public function setCreatedAt(\DateTimeInterface $created_at): self { $this->created_at = $created_at; return $this; }

    public function __construct()
{
    $this->alarms = new ArrayCollection();
}

public function getAlarms(): Collection
{
    return $this->alarms;
}
}
