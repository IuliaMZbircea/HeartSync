<?php

namespace App\Entity;

use App\Repository\ReteteMedicaleRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Entity\Consultatii;

#[ORM\Entity(repositoryClass: ReteteMedicaleRepository::class)]
class ReteteMedicale
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

   // #[ORM\Column]
   // private ?int $consultatie_id = null;

    #[ORM\ManyToOne(targetEntity: Consultatii::class, inversedBy: "reteteMedicale")]
    #[ORM\JoinColumn(name: "consultatie_id", referencedColumnName: "id", nullable: false, onDelete: "CASCADE")]
    private ?Consultatii $consultatie = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $data_expirarii = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $status = null;

    #[ORM\Column(length: 255, nullable: true, unique:true)]
    private ?string $cod_reteta = null;

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

    public function setConsultatieId(?Consultatii $consultatie): self
    {
        $this->consultatie_id = $consultatie_id;

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

    public function getCodReteta(): ?string
    {
        return $this->cod_reteta;
    }

    public function setCodReteta(?string $cod_reteta): static
    {
        $this->cod_reteta = $cod_reteta;

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
