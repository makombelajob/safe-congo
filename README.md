# SafeCongo – Plateforme d’alerte communautaire

Application web Symfony (Twig + Bootstrap + Leaflet) permettant aux citoyens de signaler des incidents (texte, photo, géolocalisation) et de les visualiser sur une carte. Inclut une API simple côté lecture pour afficher les incidents sur la carte.

## Sommaire
- Prérequis
- Démarrage rapide (Docker)
- Commandes utiles
- Structure & assets
- URLs principales
- Variables d’environnement
- Migrations base de données
- Tests (optionnel)
- Déploiement (aperçu)
- Roadmap (auth + rôles)

## Prérequis
- Docker et Docker Compose installés
- Ports libres: 8080 (app), 8081 (phpMyAdmin), 8025 (Mailhog)

## Démarrage rapide (Docker)
```bash
# À la racine du projet
docker compose up -d --build

# Application (Apache/PHP): http://localhost:8080
# phpMyAdmin:               http://localhost:8081 (host: database, user: root, pass: défini dans docker-compose.yaml)
# Mailhog (emails dev):     http://localhost:8025
```

Si nécessaire, installez les dépendances PHP à l’intérieur du conteneur PHP:
```bash
docker exec -it php_safe_congo bash -lc "cd /var/www/html && composer install --no-interaction --prefer-dist"
```

## Commandes utiles
```bash
# Générer une migration (si changements d’entités)
docker exec -it php_safe_congo bash -lc "cd /var/www/html && php bin/console make:migration -n"

# Appliquer les migrations
docker exec -it php_safe_congo bash -lc "cd /var/www/html && php bin/console doctrine:migrations:migrate -n"

# Vider le cache
docker exec -it php_safe_congo bash -lc "cd /var/www/html && php bin/console cache:clear"
```

## Structure & assets
- Code Symfony: `app/`
  - Contrôleurs: `app/src/Controller/`
  - Entités: `app/src/Entity/`
  - Templates Twig: `app/templates/`
  - Point d’entrée web: `app/public/`
- Styles personnalisés: `app/public/styles.scss` (compilé en `app/public/styles.css`)
- Scripts front: `app/public/script.js`
- Uploads photos: `app/public/uploads/`
- Documents client: `Docs/` (inclut le rapport PDF)

Styles: Bootstrap 5 (CDN) avec surcharge légère via `styles.scss`. Carte: Leaflet (CDN) + tuiles OpenStreetMap.

## URLs principales
- Accueil:           `/`
- Signaler incident: `/report`
- Carte incidents:   `/map`
- API (lecture):     `GET /api/incidents`

## Variables d’environnement (exemples)
Base MySQL fournie par Docker Compose (service `database`). Exemple de `DATABASE_URL` (injectée par Docker):
```
mysql://admin:admin7791@database:3306/safe_congo?serverVersion=8.0&charset=utf8mb4
```

Adapter si vous utilisez une autre base/infra (PostgreSQL, serveur managé, etc.).

## Migrations base de données
Les migrations Doctrine doivent être générées/appliquées dès que les entités évoluent:
```bash
# Générer
php bin/console make:migration -n
# Appliquer
php bin/console doctrine:migrations:migrate -n
```
Utilisez les commandes Docker ci‑dessus si vous travaillez dans les conteneurs.

## Tests (optionnel)
```bash
docker exec -it php_safe_congo bash -lc "cd /var/www/html && php bin/phpunit"
```

## Déploiement (aperçu)
- Construire des images et pousser vers votre registre
- Fournir `DATABASE_URL` et secrets via variables d’environnement
- Configurer un reverse proxy (TLS) et la persistance des volumes (base, uploads)
- Mettre en place backups & monitoring

Un workflow d’exemple peut être ajouté sous `.github/workflows/` (CI/CD). Voir également `Docs/` pour le rapport et la proposition client.

## Roadmap (version avec authentification)
- Authentification JWT (LexikJWTAuthenticationBundle)
- Rôles: citoyen / modérateur / admin
- API Platform (REST/GraphQL) + opérations métiers (validation, affectation, filtres géo)
- Notifications asynchrones (Messenger + transport)
- VichUploaderBundle pour la gestion avancée des médias
- Tableaux de bord (modération, admin), statistiques, export PDF/CSV
- Accessibilité renforcée et internationalisation (français + langues locales)

---
© SafeCongo – Projet de démonstration. Voir `Docs/SafeCongo-Proposal-Report.pdf` pour la documentation client détaillée.
