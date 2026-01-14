# EasyBooking

Application web avec serveur frontend React et serveur backend en node et express

## Fonctionnalités principales

- Interface utilisateur avec React et Vite
- API REST avec Node.js & Express
- Connexion à une base de données PostgreSQL externe
- Intégration avec Cloudinary pour la gestion des médias

## Configuration requise

- git
- node (>=22) et npm, ou Docker
- Base de données mongodb externe

## Instruction d'installation

### Option : En local avec Node.js

- cloner le dépot :

```bash
   git clone https://github.com/Vivien-Parsis/EasyBooking
   cd EasyBooking
```

- creer un fichier .env dans le backend :

```none
JWT_SECRET={your_secret_here}
DB_URL={your_secret_here}
HOST={your_secret_here}
PORT={your_secret_here}
```

- creer un fichier .env dans le frontend :

```none
VITE_API_URL={backend url}
```

- Installer et lancer le backend :

```bash
  cd backend
  npm install
  npm run start
```

- Installer et lancer le frontend :

```bash
  cd frontend
  npm install
  npm run preview
```

## Adresse

Frontend : `http://votre-domaine-ou-ip`

Backend : `http://votre-domaine-ou-ip:4000`

## Auteur

- Vivien PARSIS [github](https://github.com/Vivien-Parsis)
