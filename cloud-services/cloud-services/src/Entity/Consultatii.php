<?php

namespace App\Entity;

use App\Repository\ConsultatiiRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Entity\Recomandari;
use App\Entity\ReteteMedicale;
use App\Entity\Doctori;
use App\Entity\Pacienti;
use App\Entity\Diagnostice;
use App\Entity\Medicamente;

#[ORM\Entity(repositoryClass: ConsultatiiRepository::class)]
class Consultatii
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Doctori::class)]
    #[ORM\JoinColumn(name: "doctor_cnp", referencedColumnName: "cnp", nullable: false, onDelete: "CASCADE")]
    private ?Doctori $doctor = null;

    #[ORM\ManyToOne(targetEntity: Pacienti::class)]
    #[ORM\JoinColumn(name: "pacient_cnp", referencedColumnName: "cnp", nullable: false, onDelete: "CASCADE")]
    private ?Pacienti $pacient = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $data_consultatie = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $motivul_prezentarii = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $simptome = null;

    #[ORM\ManyToOne(targetEntity: Diagnostice::class)]
	#[ORM\JoinColumn(name: "diagnostic_id", referencedColumnName: "id", nullable: true, onDelete: "CASCADE")]
	private ?Diagnostice $diagnostic = null;

    #[ORM\ManyToOne(targetEntity: Medicamente::class)]
	#[ORM\JoinColumn(name: "medicament_id", referencedColumnName: "id", nullable: true, onDelete: "CASCADE")]
	private ?Medicamente $medicament = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $created_at = null;

	#[ORM\OneToMany(mappedBy: "consultatie", targetEntity: Recomandari::class, orphanRemoval: true)]
    private Collection $recomandari;
	
	#[ORM\OneToMany(mappedBy: "consultatie", targetEntity: ReteteMedicale::class, cascade: ["persist", "remove"])]
    private Collection $reteteMedicale;
	
	#[ORM\OneToMany(mappedBy: "consultatie", targetEntity: Trimiteri::class, cascade: ["persist", "remove"], orphanRemoval: true)]
    private Collection $trimiteri;

    /**
     * @return Collection|ReteteMedicale[]
     */
    public function getReteteMedicale(): Collection
    {
        return $this->reteteMedicale;
    }

    public function addReteteMedicale(ReteteMedicale $reteta): self
    {
        if (!$this->reteteMedicale->contains($reteta)) {
            $this->reteteMedicale[] = $reteta;
            $reteta->setConsultatie($this);
        }

        return $this;
    }

    public function removeReteteMedicale(ReteteMedicale $reteta): self
    {
        if ($this->reteteMedicale->removeElement($reteta)) {
            // set the owning side to null (unless already changed)
            if ($reteta->getConsultatie() === $this) {
                $reteta->setConsultatie(null);
            }
        }

        return $this;
    }
	
	public function __construct()
    {
        $this->recomandari = new ArrayCollection();
		$this->reteteMedicale = new ArrayCollection();
		$this->trimiteri = new ArrayCollection();
    }

    public function getRecomandari(): Collection
    {
        return $this->recomandari;
    }

    public function addRecomandare(Recomandari $recomandare): static
    {
        if (!$this->recomandari->contains($recomandare)) {
            $this->recomandari[] = $recomandare;
            $recomandare->setConsultatie($this);
        }

        return $this;
    }

    public function removeRecomandare(Recomandari $recomandare): static
    {
        if ($this->recomandari->removeElement($recomandare)) {
            // set the owning side to null (unless already changed)
            if ($recomandare->getConsultatie() === $this) {
                $recomandare->setConsultatie(null);
            }
        }

        return $this;
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getDoctorCnp(): ?Doctori
    {
        return $this->doctor_cnp;
    }

    public function setDoctorCnp(?Doctori $doctor_cnp): static
    {
        $this->doctor_cnp = $doctor_cnp;

        return $this;
    }

    public function getPacientCnp(): ?Pacienti
    {
        return $this->pacient_cnp;
    }

    public function setPacientCnp(?Pacienti $pacient_cnp): static
    {
        $this->pacient_cnp = $pacient_cnp;

        return $this;
    }

    public function getDataConsultatie(): ?\DateTime
    {
        return $this->data_consultatie;
    }

    public function setDataConsultatie(?\DateTime $data_consultatie): static
    {
        $this->data_consultatie = $data_consultatie;

        return $this;
    }

    public function getMotivulPrezentarii(): ?string
    {
        return $this->motivul_prezentarii;
    }

    public function setMotivulPrezentarii(?string $motivul_prezentarii): static
    {
        $this->motivul_prezentarii = $motivul_prezentarii;

        return $this;
    }

    public function getSimptome(): ?string
    {
        return $this->simptome;
    }

    public function setSimptome(?string $simptome): static
    {
        $this->simptome = $simptome;

        return $this;
    }

    public function getDiagnosticId(): ?Diagnostice
    {
        return $this->diagnostic_id;
    }

    public function setDiagnosticId(?Diagnostice $diagnostic_id): static
    {
        $this->diagnostic_id = $diagnostic_id;

        return $this;
    }

    public function getMedicamentId(): ?Medicamente
    {
        return $this->medicament_id;
    }

    public function setMedicamentId(?Medicamente $medicament): static
    {
        $this->medicament_id = $medicament_id;

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
	
	/**
     * @return Collection|Trimiteri[]
     */
    public function getTrimiteri(): Collection
    {
        return $this->trimiteri;
    }

    public function addTrimitere(Trimiteri $trimitere): static
    {
        if (!$this->trimiteri->contains($trimitere)) {
            $this->trimiteri[] = $trimitere;
            $trimitere->setConsultatie($this);
        }

        return $this;
    }

    public function removeTrimitere(Trimiteri $trimitere): static
    {
        if ($this->trimiteri->removeElement($trimitere)) {
            // setează legătura pe partea opusă la null dacă era legată
            if ($trimitere->getConsultatie() === $this) {
                $trimitere->setConsultatie(null);
            }
        }

        return $this;
    }
	
}