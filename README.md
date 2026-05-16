# 🌌 Nebula Pro — L'Explorateur de Galaxies WhatsApp

[![Deploy to GitHub Pages](https://github.com/henri983/nebula/actions/workflows/deploy.yml/badge.svg)](https://github.com/henri983/nebula/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Nebula Pro** est une plateforme d'analyse de données WhatsApp ultra-performante qui transforme vos archives `.zip` en une expérience visuelle immersive. Plongez au cœur de vos conversations à travers une interface orbitale dynamique, tout en bénéficiant d'une sécurité de niveau militaire et d'une confidentialité totale.

## ✨ Caractéristiques Uniques

### 🌀 Navigation Orbitale Dynamique
Oubliez les tableaux de bord classiques. Nebula utilise un système de navigation **gravitationnelle** où chaque catégorie de données est une planète gravitant autour d'un centre focal. Faites défiler l'univers de vos données avec une fluidité exceptionnelle.

### 📊 Analyses de Précision (Spectroscopie de Données)
*   **Chronique Galactique** : Résumé complet (messages, mots, participants, dates clés).
*   **Analyse des Médias** : Répartition précise entre Photos, Vidéos, Audios et Liens.
*   **Moteur de Réactivité** : Calculez qui répond le plus vite et identifiez les "Oiseaux de nuit" vs "Lève-tôt".
*   **Analyse Sentimentale** : Détection du "Joy Factor" via les rires et les emojis les plus utilisés.
*   **Chronologie d'Activité** : Heatmaps horaires et graphiques radiaux hebdomadaires.

### 🛡️ Confidentialité & Sécurité "Zero-Trace"
*   **100% Local** : Vos fichiers ne sont jamais téléchargés sur un serveur. Le traitement s'effectue intégralement dans la mémoire vive de votre navigateur.
*   **Conformité RGPD** : Un protocole de gouvernance des données strict est intégré.
*   **Auto-Purge** : Dès que vous quittez la page ou cliquez sur "Retour", toutes les données sont instantanément effacées de la mémoire.
*   **Verrouillage Système** : Sécurisez vos données sensibles d'un clic grâce au bouton de verrouillage intégré.

### 🎨 Design d'Élite "Solar Aurora"
*   **Arrière-plan Vivant** : Une nébuleuse animée qui change de nuances toutes les 20 secondes.
*   **Finition Premium** : Architecture "Double-Bezel" (châssis usiné + cœur de verre), typographie Montserrat et effets de flou (Glassmorphism) avancés.
*   **Full Responsive** : Une expérience optimisée pour Desktop, Tablette et Smartphone (Mobile-First).

---

## 🚀 Installation & Lancement

### Prérequis
*   [Node.js](https://nodejs.org/) (v20 ou supérieur)
*   npm ou yarn

### Installation locale
1.  Clonez le dépôt :
    ```bash
    git clone https://github.com/henri983/nebula.git
    cd nebula
    ```
2.  Installez les dépendances :
    ```bash
    npm install
    ```
3.  Lancez le serveur de développement :
    ```bash
    npm run dev
    ```
4.  Accédez à l'application via `http://localhost:5173`.

### Déploiement avec Docker
Vous pouvez lancer Nebula Pro dans un environnement isolé en utilisant Docker :
```bash
docker-compose up -d --build
```
L'application sera disponible sur `http://localhost:8080`.

---

## 🛠️ Stack Technique
*   **Framework** : [React 19](https://react.dev/)
*   **Build Tool** : [Vite](https://vitejs.dev/)
*   **Animations** : [Framer Motion](https://www.framer.com/motion/)
*   **Icônes** : [Lucide React](https://lucide.dev/)
*   **Traitement de fichiers** : [JSZip](https://stuk.github.io/.jszip/)
*   **Typographie** : Montserrat (Google Fonts)

---

## 📦 Comment obtenir votre export WhatsApp ?
1.  Ouvrez une discussion sur votre téléphone.
2.  Appuyez sur le nom du contact/groupe > **Exporter la discussion**.
3.  Sélectionnez **"Joindre les médias"** pour une analyse complète.
4.  Enregistrez l'archive `.zip` et glissez-la dans l'Uploader de Nebula.

---

## 📄 Licence
Ce projet est sous licence MIT.

---

**Développé avec ❤️ pour l'exploration de données.**  
*Nebula Pro n'est pas affilié à WhatsApp ou Meta.*
