<?php

namespace App\Controller;

use App\Repository\IncidentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MapController extends AbstractController
{
    #[Route(path: '/map', name: 'app_map')]
    public function index(): Response
    {
        return $this->render('map/index.html.twig');
    }

    #[Route(path: '/api/incidents', name: 'api_incidents', methods: ['GET'])]
    public function incidents(IncidentRepository $repository): JsonResponse
    {
        $incidents = $repository->createQueryBuilder('i')
            ->orderBy('i.createdAt', 'DESC')
            ->setMaxResults(500)
            ->getQuery()
            ->getArrayResult();

        return $this->json(array_map(function(array $i){
            return [
                'id' => $i['id'],
                'title' => $i['title'],
                'type' => $i['type'],
                'description' => $i['description'],
                'latitude' => (float) $i['latitude'],
                'longitude' => (float) $i['longitude'],
                'photoPath' => $i['photoPath'] ?? null,
                'createdAt' => ($i['createdAt'] instanceof \DateTimeInterface) ? $i['createdAt']->format(DATE_ATOM) : (string) $i['createdAt'],
            ];
        }, $incidents));
    }
}


