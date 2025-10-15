<?php

namespace App\Controller;

use App\Entity\Incident;
use App\Repository\IncidentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class IncidentController extends AbstractController
{
    #[Route(path: '/report', name: 'app_incident_report', methods: ['GET','POST'])]
    public function report(Request $request, EntityManagerInterface $em): Response
    {
        if ($request->isMethod('POST')) {
            $title = trim((string) $request->request->get('title'));
            $type = trim((string) $request->request->get('type'));
            $description = trim((string) $request->request->get('description'));
            $latitude = (float) $request->request->get('latitude');
            $longitude = (float) $request->request->get('longitude');

            if ($title && $type && $description && $latitude && $longitude) {
                $incident = new Incident();
                $incident->setTitle($title);
                $incident->setType($type);
                $incident->setDescription($description);
                $incident->setLatitude($latitude);
                $incident->setLongitude($longitude);

                /** @var UploadedFile|null $photo */
                $photo = $request->files->get('photo');
                if ($photo instanceof UploadedFile && $photo->isValid()) {
                    $uploadsDir = $this->getParameter('kernel.project_dir') . '/public/uploads';
                    $fs = new Filesystem();
                    if (!$fs->exists($uploadsDir)) {
                        $fs->mkdir($uploadsDir, 0775);
                    }
                    $safeName = pathinfo($photo->getClientOriginalName(), PATHINFO_FILENAME);
                    $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '-', $safeName) ?: 'photo';
                    $filename = sprintf('%s-%s.%s', $safeName, bin2hex(random_bytes(6)), $photo->guessExtension() ?: 'jpg');
                    $photo->move($uploadsDir, $filename);
                    $incident->setPhotoPath('/uploads/' . $filename);
                }

                $em->persist($incident);
                $em->flush();

                $this->addFlash('success', 'Incident envoyé avec succès.');
                return new RedirectResponse($this->generateUrl('app_map'));
            }

            $this->addFlash('danger', 'Veuillez remplir tous les champs requis.');
        }

        return $this->render('incident/report.html.twig');
    }
}


