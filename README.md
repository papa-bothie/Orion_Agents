# 🚨 ORION Agents - Application Terrain

## 📖 Description de l'application
**ORION Agents** est une application mobile et web conçue pour les intervenants sur le terrain (sécurité, secours, pompiers, etc.), développée dans le cadre de la gestion des incidents pour les **Jeux Olympiques de la Jeunesse (JOJ) 2026 au Sénégal**. 

L'application permet aux agents de :
- Mettre à jour leur disponibilité en temps réel (Disponible, En mission, Pause).
- Recevoir instantanément des alertes concernant des urgences et missions critiques.
- Utiliser la navigation GPS pour se rendre sur les lieux de l'incident.
- Suivre le déroulement des opérations (accepter une mission, demander des renforts, envoyer des preuves photographiques, clore l'intervention).

Le projet comprend actuellement :
1. Un **prototype web** (Dossier racine).
2. Un **squelette d'application mobile** de production (`/mobile-app`).

---

## 🚀 Comment lancer le projet

### 1. Prototype Web (React / Vite)
Situé à la racine du projet, c'est la vue initiale créée pour valider les comportements.
```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev
```

### 2. Application Mobile (React Native / Expo)
Situé dans le dossier `mobile-app/`, c'est la version finale, structurée et scalable à déployer sur les téléphones des agents (iOS / Android).
```bash
# 1. Se rendre dans le sous-dossier
cd mobile-app/

# 2. Installer les dépendances
npm install

# 3. Lancer l'application via Expo
npx expo start
```
*Note : Utilisez l'application "Expo Go" sur votre téléphone pour scanner le QR code affiché dans le terminal.*

---

## 🛠️ Outils utilisés (Stack Pédagogique)

**Pour la partie Mobile (Production) :**
- **React Native & Expo** : Création de l'application multiplateforme rapide et performante.
- **TypeScript** : Typage statique robuste pour un code fiable en équipe.
- **React Navigation** : Pour gérer la bascule entre l'écran d'authentification et les écrans applicatifs (Tabs/Stack).
- **Zustand** : Gestion de l'état global léger (Authentification et Statut de l'agent).
- **React Query (@tanstack)** : Communication avec le serveur backend (gestion du cache, chargement et retry automatique).
- **Axios** : Client HTTP configuré avec des intercepteurs pour les tokens d'accès.

---

## 🎯 Prochaines étapes (Roadmap)

Le squelette mobile est en place. Afin d'aboutir à l'application fonctionnelle complète, voici les étapes de développement suivantes :

1. **Intégration UI/UX (Dossier `/components` & `/features`) :** 
   - Migration progressive des composants Visuels (Boutons, Cartes, etc.) du Web (Tailwind/Shadcn) vers React Native (NativeWind ou StyleSheet natif).
2. **Implémentation de l'Authentification Réelle :**
   - Remplacer le "Placeholder" par un vrai masque de login, relier l'API backend pour obtenir un JWT, et l'enregistrer dans un `SecureStore`.
3. **Mise en service des Capteurs Matériels :**
   - Intégrer `expo-location` pour suivre la coordonnée GPS de l'agent et calculer sa distance vis-à-vis de l'incident.
   - Ajouter `expo-camera` pour les demandes de photos de la scène d'intervention.
4. **Temps Réel et Notifications :**
   - Câbler Expo Push Notifications et/ou des WebSockets pour déclencher l'alerte de "Mission" sur l'écran en millisecondes.
5. **Phase de Test :**
   - Rédiger des tests d'intégration pour garantir la fiabilité des actions critiques (comme "Accepter une mission" ou "Clôturer").
