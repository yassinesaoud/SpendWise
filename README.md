# SpendWise 💰

Application mobile de gestion de finances personnelles développée avec React Native et Expo.

## 📱 Fonctionnalités

### ✨ Fonctionnalités principales
- **Suivi des dépenses** : Ajoutez et gérez vos dépenses quotidiennes
- **Catégorisation automatique** : Catégorisation intelligente des dépenses
- **Gestion du budget** : Suivez votre budget mensuel avec alertes
- **Statistiques** : Visualisez vos dépenses avec graphiques et analyses
- **Prédiction de dépenses** : Prédiction de fin de mois basée sur les 30 derniers jours
- **Carte de chaleur** : Visualisation des dépenses par catégorie et jour
- **Pièces jointes** : Ajoutez des reçus photos à vos dépenses
- **Synchronisation bancaire** : Synchronisez vos transactions bancaires
- **Gestion des factures** : Gérez vos factures avec upload de documents
- **Notifications** : Alertes personnalisées pour budget et factures

### 🎨 Personnalisation
- **Mode sombre/clair** : Support complet du thème sombre
- **Sélection de devise** : TND, EUR, USD avec conversion automatique
- **Personnalisation des couleurs** : Choisissez votre couleur principale
- **Taille de police** : Ajustez la taille du texte selon vos préférences

### 🔐 Sécurité
- Authentification sécurisée
- Validation complète des formulaires
- Gestion des permissions (caméra, galerie)

## 🚀 Technologies

- **React Native** avec **Expo**
- **Expo Router** pour la navigation
- **TypeScript** pour la sécurité de type
- **AsyncStorage** pour le stockage local
- **React Native Chart Kit** pour les graphiques
- **Expo Image Picker** pour les images
- **Expo File System** pour la gestion des fichiers

## 📦 Installation

```bash
# Cloner le dépôt
git clone https://github.com/yassinesaoud/SpendWise.git

# Installer les dépendances
npm install

# Démarrer l'application
npm start
```

## 🏗️ Structure du projet

```
SpendWise/
├── app/                    # Routes Expo Router
│   ├── (auth)/            # Écrans d'authentification
│   ├── (tabs)/            # Écrans principaux
│   └── ...
├── src/
│   ├── components/        # Composants réutilisables
│   ├── context/           # Contextes React (Theme, etc.)
│   ├── hooks/             # Hooks personnalisés
│   ├── screens/           # Écrans (legacy)
│   ├── services/          # Services API
│   ├── theme/             # Configuration du thème
│   └── utils/             # Utilitaires
└── ...
```

## 🎯 Fonctionnalités détaillées

### Gestion des devises
- Support multi-devises (TND, EUR, USD)
- Conversion automatique
- Sauvegarde de préférence

### Prédiction de dépenses
- Analyse des 30 derniers jours
- Calcul de la moyenne quotidienne
- Prédiction de fin de mois
- Alertes de dépassement de budget

### Carte de chaleur
- Visualisation par catégorie (lignes)
- Visualisation par jour (colonnes)
- Intensité de couleur selon le montant

### Pièces jointes
- Capture photo ou sélection depuis galerie
- Sauvegarde sécurisée
- Aperçu dans les détails
- Suppression facile

## 📝 License

Ce projet est sous licence MIT.

## 👤 Auteur

**Yassine Saoud**
- GitHub: [@yassinesaoud](https://github.com/yassinesaoud)

## 🙏 Remerciements

Merci d'utiliser SpendWise ! Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue.
