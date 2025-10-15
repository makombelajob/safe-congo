<?php

namespace App\Entity;

use App\Repository\IncidentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: IncidentRepository::class)]
#[ORM\Table(name: 'incident')]
class Incident
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private string $title;

    #[ORM\Column(length: 60)]
    private string $type;

    #[ORM\Column(type: Types::TEXT)]
    private string $description;

    #[ORM\Column(type: Types::FLOAT)]
    private float $latitude;

    #[ORM\Column(type: Types::FLOAT)]
    private float $longitude;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(type: Types::STRING, nullable: true)]
    private ?string $photoPath = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }
    public function getTitle(): string { return $this->title; }
    public function setTitle(string $title): void { $this->title = $title; }
    public function getType(): string { return $this->type; }
    public function setType(string $type): void { $this->type = $type; }
    public function getDescription(): string { return $this->description; }
    public function setDescription(string $description): void { $this->description = $description; }
    public function getLatitude(): float { return $this->latitude; }
    public function setLatitude(float $latitude): void { $this->latitude = $latitude; }
    public function getLongitude(): float { return $this->longitude; }
    public function setLongitude(float $longitude): void { $this->longitude = $longitude; }
    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
    public function getPhotoPath(): ?string { return $this->photoPath; }
    public function setPhotoPath(?string $photoPath): void { $this->photoPath = $photoPath; }
}


