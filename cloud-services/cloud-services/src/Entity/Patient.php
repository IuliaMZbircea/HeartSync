<?php

namespace App\Entity;

use App\Repository\PatientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\Entity\Allergy;
use App\Entity\Alarm;
use App\Entity\Disease;
use App\Entity\Medication;
use App\Entity\Consultation;
use App\Entity\Referral;
use App\Entity\Recommendation;
use App\Entity\SensorAlertThresholds;
#[ApiResource]
#[ORM\Entity(repositoryClass: PatientRepository::class)]
#[ORM\Table(name: 'patient')]
class Patient
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $email = null;

    #[ORM\Column(length: 50)]
    private ?string $phone = null;

    #[ORM\Column(length: 100)]
    private ?string $firstName = null;

    #[ORM\Column(length: 100)]
    private ?string $lastName = null;

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

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $apartment = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $floor = null;

    #[ORM\Column(length: 3)]
    private ?string $bloodGroup = null;

    #[ORM\Column(length: 3)]
    private ?string $rh = null;

    #[ORM\Column(type: Types::FLOAT)]
    private ?float $weight = null;

    #[ORM\Column(type: Types::FLOAT)]
    private ?float $height = null;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private ?bool $validAccount = true;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $birthDate = null;

    #[ORM\Column(type: 'string', columnDefinition: "ENUM('M','F')", nullable: true)]
    private ?string $sex = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $patientHistory = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private ?bool $isActive = true;

    #[ORM\OneToMany(mappedBy: 'patient', targetEntity: Allergy::class, cascade: ['persist', 'remove'])]
    private Collection $allergies;

    #[ORM\OneToMany(mappedBy: 'patient', targetEntity: Alarm::class, cascade: ['persist', 'remove'])]
    private Collection $alarms;

    #[ORM\OneToMany(mappedBy: 'patient', targetEntity: Disease::class, cascade: ['persist'], orphanRemoval: false)]
    private Collection $diseases;

    #[ORM\OneToMany(mappedBy: 'patient', targetEntity: Medication::class, cascade: ['persist', 'remove'])]
    private Collection $medications;

    #[ORM\OneToMany(mappedBy: 'patient', targetEntity: Consultation::class, cascade: ['persist', 'remove'])]
    private Collection $consultations;

    #[ORM\OneToMany(mappedBy: 'patient', targetEntity: Referral::class, cascade: ['persist', 'remove'])]
    private Collection $referrals;

    #[ORM\OneToMany(mappedBy: 'patient', targetEntity: Recommendation::class, cascade: ['remove'])]
    private Collection $recommendations;

    #[ORM\OneToMany(mappedBy: 'patient', targetEntity: SensorAlertThreshold::class, cascade: ['remove'])]
    private Collection $sensorAlertThresholds;

    public function __construct()
    {
        $this->allergies = new ArrayCollection();
        $this->alarms = new ArrayCollection();
        $this->diseases = new ArrayCollection();
        $this->medications = new ArrayCollection();
        $this->consultations = new ArrayCollection();
        $this->referrals = new ArrayCollection();
        $this->recommendations = new ArrayCollection();
        $this->sensorAlertThresholds = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }
    public function getEmail(): ?string { return $this->email; }
    public function setEmail(string $email): self { $this->email = $email; return $this; }
    public function getPhone(): ?string { return $this->phone; }
    public function setPhone(string $phone): self { $this->phone = $phone; return $this; }
    public function getFirstName(): ?string { return $this->firstName; }
    public function setFirstName(string $firstName): self { $this->firstName = $firstName; return $this; }
    public function getLastName(): ?string { return $this->lastName; }
    public function setLastName(string $lastName): self { $this->lastName = $lastName; return $this; }
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
    public function getBloodGroup(): ?string { return $this->bloodGroup; }
    public function setBloodGroup(string $bloodGroup): self { $this->bloodGroup = $bloodGroup; return $this; }
    public function getRh(): ?string { return $this->rh; }
    public function setRh(string $rh): self { $this->rh = $rh; return $this; }
    public function getWeight(): ?float { return $this->weight; }
    public function setWeight(float $weight): self { $this->weight = $weight; return $this; }
    public function getHeight(): ?float { return $this->height; }
    public function setHeight(float $height): self { $this->height = $height; return $this; }
    public function isValidAccount(): ?bool { return $this->validAccount; }
    public function setValidAccount(bool $validAccount): self { $this->validAccount = $validAccount; return $this; }
    public function getBirthDate(): ?\DateTimeInterface { return $this->birthDate; }
    public function setBirthDate(?\DateTimeInterface $birthDate): self { $this->birthDate = $birthDate; return $this; }
    public function getSex(): ?string { return $this->sex; }
    public function setSex(?string $sex): self { $this->sex = $sex; return $this; }
    public function getPatientHistory(): ?array { return $this->patientHistory; }
    public function setPatientHistory(?array $patientHistory): self { $this->patientHistory = $patientHistory; return $this; }
    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
    public function setCreatedAt(?\DateTimeInterface $createdAt): self { $this->createdAt = $createdAt; return $this; }
    public function isIsActive(): ?bool { return $this->isActive; }
    public function setIsActive(bool $isActive): self { $this->isActive = $isActive; return $this; }

    // Allergies
    public function getAllergies(): Collection { return $this->allergies; }
    public function addAllergy(Allergy $allergy): self
    {
        if (!$this->allergies->contains($allergy)) {
            $this->allergies[] = $allergy;
            $allergy->setPatient($this);
        }
        return $this;
    }

    public function removeAllergy(Allergy $allergy): self
    {
        if ($this->allergies->removeElement($allergy)) {
            if ($allergy->getPatient() === $this) {
                $allergy->setPatient(null);
            }
        }
        return $this;
    }

    // Alarms
    public function getAlarms(): Collection { return $this->alarms; }
    public function addAlarm(Alarm $alarm): self
    {
        if (!$this->alarms->contains($alarm)) {
            $this->alarms[] = $alarm;
            $alarm->setPatient($this);
        }
        return $this;
    }

    public function removeAlarm(Alarm $alarm): self
    {
        if ($this->alarms->removeElement($alarm)) {
            if ($alarm->getPatient() === $this) {
                $alarm->setPatient(null);
            }
        }
        return $this;
    }

    // Diseases
    public function getDiseases(): Collection
    {
        return $this->diseases;
    }

    public function addDisease(Disease $disease): static
    {
        if (!$this->diseases->contains($disease)) {
            $this->diseases->add($disease);
            $disease->setPatient($this);
        }
        return $this;
    }

    public function removeDisease(Disease $disease): static
    {
        if ($this->diseases->removeElement($disease)) {
            if ($disease->getPatient() === $this) {
                $disease->setPatient(null);
            }
        }
        return $this;
    }

    //Medication
    public function getMedications(): Collection
{
    return $this->medications;
}

public function addMedication(Medication $medication): static
{
    if (!$this->medications->contains($medication)) {
        $this->medications[] = $medication;
        $medication->setPatient($this);
    }
    return $this;
}

public function removeMedication(Medication $medication): static
{
    if ($this->medications->removeElement($medication)) {
        if ($medication->getPatient() === $this) {
            $medication->setPatient(null);
        }
    }
    return $this;
}

//Consultation

public function getConsultations(): Collection
{
    return $this->consultations;
}

public function addConsultation(Consultation $consultation): self
{
    if (!$this->consultations->contains($consultation)) {
        $this->consultations[] = $consultation;
        $consultation->setPatient($this);
    }
    return $this;
}

public function removeConsultation(Consultation $consultation): self
{
    if ($this->consultations->removeElement($consultation)) {
        if ($consultation->getPatient() === $this) {
            $consultation->setPatient(null);
        }
    }
    return $this;
}

//Referral

public function getReferrals(): Collection
{
    return $this->referrals;
}
public function addReferral(Referral $referral): self
{
    if (!$this->referrals->contains($referral)) {
        $this->referrals[] = $referral;
        $referral->setPatient($this);
    }
    return $this;
}
public function removeReferral(Referral $referral): self
{
    if ($this->referrals->removeElement($referral)) {
        if ($referral->getPatient() === $this) {
            $referral->setPatient(null);
        }
    }
    return $this;
}
//Recommendation

public function getRecommendations(): Collection
{
    return $this->recommendations;
}

public function addRecommendation(Recommendation $recommendation): self
{
    if (!$this->recommendations->contains($recommendation)) {
        $this->recommendations[] = $recommendation;
        $recommendation->setPatient($this);
    }
    return $this;
}

public function removeRecommendation(Recommendation $recommendation): self
{
    if ($this->recommendations->removeElement($recommendation)) {
        if ($recommendation->getPatient() === $this) {
            $recommendation->setPatient(null);
        }
    }
    return $this;
}

//Thresholds
public function getSensorAlertThresholds(): Collection
{
    return $this->sensorAlertThresholds;
}

public function addSensorAlertThreshold(SensorAlertThreshold $threshold): self
{
    if (!$this->sensorAlertThresholds->contains($threshold)) {
        $this->sensorAlertThresholds[] = $threshold;
        $threshold->setPatient($this);
    }
    return $this;
}

public function removeSensorAlertThreshold(SensorAlertThreshold $threshold): self
{
    if ($this->sensorAlertThresholds->removeElement($threshold)) {
        if ($threshold->getPatient() === $this) {
            $threshold->setPatient(null);
        }
    }
    return $this;
}
}