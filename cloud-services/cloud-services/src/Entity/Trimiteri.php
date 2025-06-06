<?php

namespace App\Entity;

use App\Repository\TrimiteriRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Consultatii;

#[ORM\Entity(repositoryClass: TrimiteriRepository::class)]
class Trimiteri
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Consultatii::class, inversedBy: "trimiteri")]
    #[ORM\JoinColumn(name: "consultatie_id", referencedColumnName: "id", nullable: false, onDelete: "CASCADE")]
    private ?Consultatii $consultatie = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $tip_trimitere = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $detalii = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $data_eliberarii = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $data_expirarii = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $status = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $motiv = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $cod_trimitere = null;

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

    public function setConsultatie(?Consultatii $consultatie): static
    {
        $this->consultatie = $consultatie;

        return $this;
    }

    public function getTipTrimitere(): ?string
    {
        return $this->tip_trimitere;
    }

    public function setTipTrimitere(?string $tip_trimitere): static
    {
        $this->tip_trimitere = $tip_trimitere;

        return $this;
    }

    public function getDetalii(): ?string
    {
        return $this->detalii;
    }

    public function setDetalii(?string $detalii): static
    {
        $this->detalii = $detalii;

        return $this;
    }

    public function getDataEliberarii(): ?\DateTime
    {
        return $this->data_eliberarii;
    }

    public function setDataEliberarii(?\DateTime $data_eliberarii): static
    {
        $this->data_eliberarii = $data_eliberarii;

        return $this;
    }

    public function getDataExpirarii(): ?\DateTime
    {
        return $this->data_expirarii;
    }

    public function setDataExpirarii(?\DateTime $data_expirarii): static
    {
        $this->data_expirarii = $data_expirarii;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(?string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getMotiv(): ?string
    {
        return $this->motiv;
    }

    public function setMotiv(?string $motiv): static
    {
        $this->motiv = $motiv;

        return $this;
    }

    public function getCodTrimitere(): ?string
    {
        return $this->cod_trimitere;
    }

    public function setCodTrimitere(?string $cod_trimitere): static
    {
        $this->cod_trimitere = $cod_trimitere;

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
