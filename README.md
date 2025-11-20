# Focus Flow 🧠

**Application de productivité intelligente qui adapte les tâches à ton humeur et ton énergie**

## Fonctionnalités Principales

### Adaptation Intelligente
- **Saisie d'humeur** : Sliders énergie/focus en temps réel  
- **Algorithme de priorisation** : Recommande les tâches selon ton état
- **Classification automatique** : 🎯 Recommandé / 💡 À considérer / 💤 Pas maintenant

### Gestion Complète  
- **Ajout de tâches** : Formulaire avec durée, énergie requise, focus, priorité
- **Marquage des tâches** : Cocher les tâches terminées
- **Historique des humeurs** : Graphiques d'évolution sur 30 jours
- **Dashboard visuel** : Interface moderne et responsive

## 🚀 Installation & Démarrage

```bash
# 1. Cloner le repository
git clone https://github.com/ton-username/focus-flow-app.git
cd focus-flow-app

# 2. Lancer avec Docker  
docker compose up --build

# 3. Accéder à l'application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000

# 4. Développement local 
# Terminal 1 - Backend & Database
docker compose up backend db

# Terminal 2 - Frontend (dans un nouveau terminal)
cd frontend
npm install
npm run dev

# L'application sera disponible sur http://localhost:3000