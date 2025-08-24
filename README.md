# 🏢 A&M Capital - Simulateur d'Investissement Locatif

> Simulateur professionnel avec données de marché en temps réel pour l'investissement immobilier

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

## 🎯 Présentation

Application de simulation d'investissement immobilier permettant de calculer la rentabilité d'un bien en location longue et courte durée (Airbnb). Développée pour A&M Capital dans le cadre d'un cas pratique développeur fullstack.

### ✨ Fonctionnalités principales

- 🏠 **Simulation interactive** avec sliders temps réel
- 📊 **Calculs automatiques** de rentabilité (brute, nette, cash-flow)
- 🏘️ **Base de données** de 27+ villes françaises
- 📱 **Design responsive** mobile-first
- 🔄 **APIs simulées** avec fallbacks robustes
- 📋 **Formulaire de contact** avec validation
- 🎨 **Interface moderne** avec animations

## 🚀 Démo

- **URL de démo** : [Voir la démo](https://am-capital-simulator.vercel.app)
- **Repository** : [GitHub](https://github.com/LeYonko/am-capital-simulator)

## 🛠️ Stack Technique

### Frontend
- **Next.js 14+** avec App Router
- **TypeScript 5.0+** pour la sécurité des types
- **Tailwind CSS 3.4+** pour le styling (CDN)
- **Lucide React** pour les icônes
- **React Hooks** pour la gestion d'état

### Backend/APIs
- **Next.js API Routes** pour les endpoints
- **APIs simulées** avec cache en mémoire
- **Fallbacks** sur données locales

### Outils de développement
- **ESLint** pour la qualité du code
- **Git** pour le versioning
- **GitHub** pour l'hébergement du code

### Déploiement
- **Vercel/Netlify** recommandés
- **Variables d'environnement** pour la configuration

## 📦 Installation

### Prérequis
- **Node.js** 18.0+ ([télécharger](https://nodejs.org/))
- **npm** ou **yarn**
- **Git**

### Étapes d'installation

```bash
# 1. Cloner le repository
git clone https://github.com/LeYonko/am-capital-simulator.git
cd am-capital-simulator

# 2. Installer les dépendances
npm install

# 3. Créer le fichier d'environnement
cp .env.local.example .env.local

# 4. Configurer les variables (optionnel)
# Éditez .env.local avec vos clés API

# 5. Démarrer en mode développement
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

### Dépendances principales

```json
{
  "dependencies": {
    "next": "14.2.4",
    "react": "^18",
    "react-dom": "^18",
    "typescript": "^5",
    "lucide-react": "^0.263.1",
    "clsx": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.4"
  }
}
```

### Installation des librairies

```bash
# Librairies principales
npm install next react react-dom typescript

# Types TypeScript
npm install -D @types/node @types/react @types/react-dom

# Icônes et utilitaires
npm install lucide-react clsx class-variance-authority tailwind-merge

# Développement et linting
npm install -D eslint eslint-config-next

# Librairies bonus
npm install axios jspdf recharts  # APIs, PDF, Graphiques
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env.local` :

```bash
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="A&M Capital Simulator"

# API Keys (optionnel - fallbacks inclus)
MEILLEURSAGENTS_API_KEY=your_api_key
AIRDNA_API_KEY=your_api_key
AIRDNA_API_SECRET=your_api_secret

# Base de données (optionnel)
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url

# Monitoring (optionnel)
SENTRY_DSN=your_sentry_dsn
GOOGLE_ANALYTICS_ID=your_ga_id
```

### Tailwind CSS

L'application utilise Tailwind via CDN pour éviter les problèmes de configuration. La configuration se trouve dans `src/app/layout.tsx`.

## 📊 Formules de Calcul

### Coûts d'Acquisition

```
Coût Total = Prix du Bien + Frais Notaire + Commission A&M + Frais Architecte

Frais Notaire = Prix × 9%
Commission A&M = Prix × 8.5%
Frais Architecte = Surface × (90€/m² LD ou 120€/m² CD)
```

### Revenus Locatifs

#### Location Longue Durée
```
Loyer Mensuel = Prix/m² × Surface × Coefficient_Pièces

Coefficients par pièces (données marché 2025) :
- Studio : +39% (×1.39)
- T2 : Référence (×1.0)
- T3 : -19% (×0.81)
- T4 : -20% (×0.80)
```

#### Location Courte Durée (Airbnb)
```
Loyer Mensuel = Loyer_LD × 3.0 × Taux_Occupation

Taux d'occupation = 70% (par défaut)
Multiplicateur Airbnb = 3x la location longue durée
```

### Calculs de Rentabilité

```
Rendement Brut = (Loyer Annuel / Coût Total) × 100

Rendement Net = ((Loyer - Charges) × 12 / Coût Total) × 100

Cash-Flow = Loyer - Charges - Mensualité Crédit

ROI = ((Loyer - Charges - Crédit) × 12 / Apport) × 100
```

### Charges et Frais

```
Charges Mensuelles = Gestion + Vacance + Assurance + Taxe + Maintenance

Frais de gestion = Loyer × 8%
Vacance locative = Loyer × 5%
Assurance PNO = 400€/an
Taxe foncière = Valeur × 1.5%/an
Maintenance = Valeur × 2%/an
```

## 🏗️ Architecture

```
src/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # Layout principal avec Tailwind CDN
│   ├── page.tsx           # Page d'accueil
│   ├── globals.css        # Styles globaux (minimal)
│   └── api/               # API Routes
│       ├── rent-data/     # Données location longue durée
│       └── airbnb-data/   # Données location courte durée
├── components/            # Composants React
│   ├── ui/               # Composants UI réutilisables
│   │   ├── button.tsx    # Bouton avec variants
│   │   ├── input.tsx     # Input avec icônes
│   │   ├── slider.tsx    # Slider personnalisé
│   │   └── ...           # Autres composants UI
│   ├── Header.tsx        # En-tête avec navigation
│   ├── HeroSection.tsx   # Section héros avec animations
│   ├── Simulator.tsx     # Simulateur principal
│   ├── ResultsPanel.tsx  # Panneau de résultats
│   ├── ContactForm.tsx   # Formulaire de contact
    ├── PDFPreview.tsx    # Fonctions génération du PDF
│   └── Footer.tsx        # Pied de page
└── lib/                  # Logique métier et utilitaires
    ├── types.ts          # Définitions TypeScript
    ├── constants.ts      # Constantes et données villes
    ├── calculations.ts   # Formules de calcul
    ├── utils.ts          # Fonctions utilitaires
    ├── pdf-service.ts    # Informations sur le PDF généré
    └── api-clients.ts    # Clients API avec gestion d'erreurs
    

```

## 🌍 Données de Marché

### Villes Supportées (27+)

**Grandes métropoles :**
Paris, Lyon, Marseille, Toulouse, Nice, Nantes, Montpellier, Strasbourg, Bordeaux, Lille

**Villes moyennes :**
Rennes, Reims, Saint-Étienne, Toulon, Grenoble, Dijon, Angers, Nîmes, Villeurbanne, Clermont-Ferrand

**Villes côtières et touristiques :**
Cannes, Antibes, Biarritz, La Rochelle, Saint-Malo, Deauville, Arcachon

### Source des Données

- **Base de données locale** avec prix/m² par ville
- **Coefficients de marché** 2025 par type de bien
- **Multiplicateurs Airbnb** basés sur des études de marché
- **Fallbacks robustes** si APIs externes indisponibles

## 🔄 APIs

### Endpoints Disponibles

#### `/api/rent-data`
- **Méthode** : GET
- **Paramètres** : `city`, `rooms`, `surface` (optionnel)
- **Description** : Données de location longue durée
- **Cache** : 10 minutes

#### `/api/airbnb-data`
- **Méthode** : GET
- **Paramètres** : `city`, `rooms`, `surface`
- **Description** : Données de location courte durée avec saisonnalité
- **Cache** : 15 minutes

### Intégrations Externes (Optionnelles)

#### MeilleursAgents API
- **Endpoint** : Scraping `meilleursagents.com/prix-immobilier/[ville]`
- **Fallback** : Base de données locale (27 villes)
- **Temps de réponse** : < 2 secondes

#### AirDNA API
- **Endpoint** : `api.airdna.co/v1`
- **Données** : Revenus Airbnb avec taux d'occupation
- **Fallback** : Calcul estimé (×3 location longue durée)

## 🚀 Scripts Disponibles

```bash
# Développement
npm run dev          # Serveur de développement (port 3000)
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification ESLint

# Utilitaires
npm run type-check   # Vérification TypeScript
npm run clean        # Nettoyage des caches
```

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Installation CLI
npm i -g vercel

# Déploiement
vercel

# Production
vercel --prod
```

### Netlify

```bash
# Build
npm run build

# Déploiement via interface web ou CLI
netlify deploy --prod --dir=.next
```

### Variables d'Environnement

Configurez ces variables sur votre plateforme de déploiement :

```bash
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
MEILLEURSAGENTS_API_KEY=optional
AIRDNA_API_KEY=optional
```

## 📈 Performance

### Optimisations Implémentées

- ✅ **Debounce** sur les calculs (500ms)
- ✅ **Cache API** en mémoire (10-15 min)
- ✅ **Lazy loading** des composants
- ✅ **Code splitting** automatique Next.js
- ✅ **Images optimisées** avec Next.js Image

### Métriques Cibles

- **First Contentful Paint** : < 1.0s
- **Time to Interactive** : < 2.5s
- **Lighthouse Score** : > 90

## 🔒 Sécurité

- ✅ **Validation** des données côté client et serveur
- ✅ **Sanitisation** des entrées utilisateur
- ✅ **Rate limiting** sur les APIs (fallback si dépassé)
- ✅ **CORS** configuré correctement
- ✅ **Variables d'environnement** sécurisées

## 🐛 Limitations Connues

### Techniques
1. **APIs Externes** : MeilleursAgents et AirDNA nécessitent des clés d'accès payantes
2. **Données** : Base locale limitée à 27 villes (extensible)
3. **Cache** : En mémoire uniquement (perdu au redémarrage)

### Fonctionnelles
1. **Calculs** : Estimations basées sur des moyennes de marché
2. **Fiscalité** : Calculs simplifiés (TMI par défaut 30%)
3. **Géolocalisation** : Pas d'auto-détection de ville

### Navigateurs
1. **Sliders** : Styles peuvent varier selon navigateur
2. **Animations** : Performances réduites sur anciens appareils

## 🔮 Améliorations Futures

### Fonctionnalités Avancées
- [ ] **Graphiques** de rentabilité avec Recharts
- [ ] **Comparaison** multi-villes simultanée
- [ ] **Historique** des simulations
- [ ] **Notifications** push pour opportunités
- [ ] **Mode sombre** avec toggle

### Technique
- [ ] **Tests E2E** avec Playwright
- [ ] **CI/CD Pipeline** GitHub Actions
- [ ] **Base de données** PostgreSQL + Prisma
- [ ] **Redis** pour le cache distribué
- [ ] **Monitoring** avec Sentry
- [ ] **Analytics** détaillées avec Mixpanel

### Intégrations
- [ ] **APIs réelles** MeilleursAgents + AirDNA
- [ ] **Géolocalisation** automatique
- [ ] **Calendrier** Calendly pour RDV
- [ ] **CRM** intégration (HubSpot)
- [ ] **Paiement** Stripe pour services premium

## 📞 Support et Contribution


### Guidelines
1. **Fork** le projet
2. **Créez** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Poussez** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

**Développé par** : [Arthur Mbuyi](https://github.com/arthurmbuyim)
**Pour** : A&M Capital
**Dans le cadre** : Cas pratique développeur fullstack

---

## 🙏 Remerciements

- **Next.js Team** pour le framework exceptionnel
- **Tailwind CSS** pour le système de design
- **Lucide** pour les icônes magnifiques
- **Vercel** pour l'hébergement gratuit
- **A&M Capital** pour le challenge technique

---
