# Plan de Test Backend

## Module Personne (Tests d'Intégration)

Ce module gère l'inscription et la connexion des utilisateurs.

### 1. Inscription (POST /person/register)

| ID | Cas de Test | Données d'entrée | Résultat Attendu | Statut HTTP |
| :--- | :--- | :--- | :--- | :--- |
| **P-REG-01** | **Inscription réussie** | Email valide, Mot de passe valide (ex: "password123"), Confirmation identique, Nom, Prénom | Un token JWT est retourné. | 200 OK |
| **P-REG-02** | **Données manquantes** | L'un des champs (email, password, nom, prénom) est vide ou absent | Message d'erreur "missing credential". | 422 Unprocessable Entity |
| **P-REG-03** | **Mots de passe non identiques** | Mot de passe différent de la confirmation | Message d'erreur "password not equal no confirmation password". | 422 Unprocessable Entity |
| **P-REG-04** | **Format mot de passe invalide** | Mot de passe trop court ou avec espaces (ex: "pw") | Message d'erreur indiquant les critères (6-30 caractères, sans espaces). | 422 Unprocessable Entity |
| **P-REG-05** | **Utilisateur déjà existant** | Email déjà utilisé dans la base de données | Message d'erreur "person already exist". | 409 Conflict |

### 2. Connexion (POST /person/login)

| ID | Cas de Test | Données d'entrée | Résultat Attendu | Statut HTTP |
| :--- | :--- | :--- | :--- | :--- |
| **P-LOG-01** | **Connexion réussie** | Email existant, Mot de passe correct | Un token JWT est retourné. | 200 OK |
| **P-LOG-02** | **Données manquantes** | Email ou mot de passe manquant | Message d'erreur "missing credential". | 422 Unprocessable Entity |
| **P-LOG-03** | **Utilisateur inconnu** | Email qui n'existe pas en base | Message d'erreur "person not found". | 404 Not Found |
| **P-LOG-04** | **Mot de passe incorrect** | Email existant, mais mauvais mot de passe | Message d'erreur "password or email not match". | 401 Unauthorized |

## Module Réservation (Tests d'Intégration)

Ce module permet aux utilisateurs authentifiés de gérer leurs réservations.

### 1. Ajouter une réservation (POST /reservation/person/add)

| ID | Cas de Test | Données d'entrée | Résultat Attendu | Statut HTTP |
| :--- | :--- | :--- | :--- | :--- |
| **R-ADD-01** | **Ajout réussi** | Token valide, Salle ID, Date, Heure début, Heure fin | La réservation est créée et retournée. | 200 OK |
| **R-ADD-02** | **Salle déjà réservée** | Même salle, même créneau horaire qu'une réservation existante | Message d'erreur "Room already reserved". | 400 Bad Request |
| **R-ADD-03** | **Paramètres manquants** | Manque salle, date, heure ou heure de fin | Message d'erreur "Missing parameters". | 400 Bad Request |
| **R-ADD-04** | **Non authentifié** | Aucun token ou token invalide | Refus d'accès. | 401/403 (middleware) |

### 2. Lister les réservations (GET /reservation/person)

| ID | Cas de Test | Données d'entrée | Résultat Attendu | Statut HTTP |
| :--- | :--- | :--- | :--- | :--- |
| **R-LIST-01** | **Liste réussie** | Token valide | Retourne la liste des réservations de l'utilisateur (triée par date ASC). | 200 OK |

### 3. Supprimer une réservation (DELETE /reservation/person)

| ID | Cas de Test | Données d'entrée | Résultat Attendu | Statut HTTP |
| :--- | :--- | :--- | :--- | :--- |
| **R-DEL-01** | **Suppression réussie** | Token valide, ID de réservation existant et appartenant à l'utilisateur | La réservation est supprimée. | 200 OK |
| **R-DEL-02** | **ID manquant** | Corps de requête sans ID | Message d'erreur "Missing id". | 400 Bad Request |
| **R-DEL-03** | **Non autorisé (Autre utilisateur)** | Token valide A, mais ID de réservation appartenant à l'utilisateur B | Message d'erreur "You are not authorized to delete this reservation". | 401 Unauthorized |
| **R-DEL-04** | **Réservation introuvable** | ID qui n'existe pas en base | Message d'erreur "Reservation not found". | 404 Not Found |

## Service Authentification (Tests Unitaires)

Ce module gère la logique métier de l'authentification (génération de token).

### 1. Génération de Token (generateToken)

| ID | Cas de Test | Données d'entrée | Résultat Attendu |
| :--- | :--- | :--- | :--- |
| **A-GEN-01** | **Génération valide** | Objet utilisateur avec ID et Email | Le token retourné est une chaîne valide contenant l'ID et l'Email décodables. |
| **A-GEN-02** | **Champs vides** | Objet utilisateur avec champs vides | Retourne `null`. |
