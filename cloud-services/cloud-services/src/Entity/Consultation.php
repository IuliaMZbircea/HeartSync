<?php

namespace App\Entity;

use App\Repository\ConsultationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\Entity\Patient;

#[ApiResource]
#[ORM\Entity(repositoryClass: ConsultationRepository::class)]
class Consultation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Patient::class)]
    #[ORM\JoinColumn(name: "patient_id", referencedColumnName: "id", nullable: false, onDelete: "CASCADE")]
    private ?Patient $patient = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $dateTime = null;

    #[ORM\Column(length: 255)]
    private ?string $doctorName = null;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $durationMinutes = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $symptoms = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $currentMedicationIds = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $medicalHistoryIds = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $familyHistory = null;

    #[ORM\Column(type: 'float', nullable: true)]
    private ?float $pulse = null;

    #[ORM\Column(type: 'string', length: 50, nullable: true)]
    private ?string $bloodPressure = null;

    #[ORM\Column(type: 'float', nullable: true)]
    private ?float $temperature = null;

    #[ORM\Column(type: 'float', nullable: true)]
    private ?float $weightKg = null;

    #[ORM\Column(type: 'float', nullable: true)]
    private ?float $heightCm = null;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $respiratoryRate = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $notes = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $diagnosisIds = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $referralIds = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $prescriptionIds = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: 'boolean', options: ['default' => true])]
    private ?bool $isActive = true;

    // === Getters and Setters ===

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPatient(): ?Patient
    {
        return $this->patient;
    }

    public function setPatient(?Patient $patient): self
    {
        $this->patient = $patient;
        return $this;
    }

    public function getDateTime(): ?\DateTimeInterface
    {
        return $this->dateTime;
    }

    public function setDateTime(\DateTimeInterface $dateTime): self
    {
        $this->dateTime = $dateTime;
        return $this;
    }

    public function getDoctorName(): ?string
    {
        return $this->doctorName;
    }

    public function setDoctorName(string $doctorName): self
    {
        $this->doctorName = $doctorName;
        return $this;
    }

    public function getDurationMinutes(): ?int
    {
        return $this->durationMinutes;
    }

    public function setDurationMinutes(?int $durationMinutes): self
    {
        $this->durationMinutes = $durationMinutes;
        return $this;
    }

    public function getSymptoms(): ?string
    {
        return $this->symptoms;
    }

    public function setSymptoms(string $symptoms): self
    {
        $this->symptoms = $symptoms;
        return $this;
    }

    public function getCurrentMedicationIds(): ?string
    {
        return $this->currentMedicationIds;
    }

    public function setCurrentMedicationIds(?string $currentMedicationIds): self
    {
        $this->currentMedicationIds = $currentMedicationIds;
        return $this;
    }

    public function getMedicalHistoryIds(): ?string
    {
        return $this->medicalHistoryIds;
    }

    public function setMedicalHistoryIds(?string $medicalHistoryIds): self
    {
        $this->medicalHistoryIds = $medicalHistoryIds;
        return $this;
    }

    public function getFamilyHistory(): ?string
    {
        return $this->familyHistory;
    }

    public function setFamilyHistory(?string $familyHistory): self
    {
        $this->familyHistory = $familyHistory;
        return $this;
    }

    public function getPulse(): ?float
    {
        return $this->pulse;
    }

    public function setPulse(?float $pulse): self
    {
        $this->pulse = $pulse;
        return $this;
    }

    public function getBloodPressure(): ?string
    {
        return $this->bloodPressure;
    }

    public function setBloodPressure(?string $bloodPressure): self
    {
        $this->bloodPressure = $bloodPressure;
        return $this;
    }

    public function getTemperature(): ?float
    {
        return $this->temperature;
    }

    public function setTemperature(?float $temperature): self
    {
        $this->temperature = $temperature;
        return $this;
    }

    public function getWeightKg(): ?float
    {
        return $this->weightKg;
    }

    public function setWeightKg(?float $weightKg): self
    {
        $this->weightKg = $weightKg;
        return $this;
    }

    public function getHeightCm(): ?float
    {
        return $this->heightCm;
    }

    public function setHeightCm(?float $heightCm): self
    {
        $this->heightCm = $heightCm;
        return $this;
    }

    public function getRespiratoryRate(): ?int
    {
        return $this->respiratoryRate;
    }

    public function setRespiratoryRate(?int $respiratoryRate): self
    {
        $this->respiratoryRate = $respiratoryRate;
        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): self
    {
        $this->notes = $notes;
        return $this;
    }

    public function getDiagnosisIds(): ?string
    {
        return $this->diagnosisIds;
    }

    public function setDiagnosisIds(?string $diagnosisIds): self
    {
        $this->diagnosisIds = $diagnosisIds;
        return $this;
    }

    public function getReferralIds(): ?string
    {
        return $this->referralIds;
    }

    public function setReferralIds(?string $referralIds): self
    {
        $this->referralIds = $referralIds;
        return $this;
    }

    public function getPrescriptionIds(): ?string
    {
        return $this->prescriptionIds;
    }

    public function setPrescriptionIds(?string $prescriptionIds): self
    {
        $this->prescriptionIds = $prescriptionIds;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): self
    {
        $this->isActive = $isActive;
        return $this;
    }
}