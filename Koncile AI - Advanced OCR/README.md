# Koncile AI - Advanced OCR - Intégration Zapier

Une intégration Zapier puissante pour Koncile.ai qui permet l'automatisation des téléchargements de fichiers avec des capacités OCR avancées basées sur l'intelligence artificielle.

## 🚀 Fonctionnalités

- **Téléchargement automatisé** : Upload de fichiers vers Koncile.ai via les workflows Zapier
- **OCR avancé** : Traitement automatique des documents avec l'IA de Koncile
- **Gestion intelligente** : Organisation par dossiers et templates personnalisés
- **Authentification sécurisée** : Protection par clé API
- **Streaming optimisé** : Téléchargement et upload efficaces des fichiers volumineux

## 📋 Prérequis

- Node.js 14+
- Compte Koncile.ai actif
- Clé API Koncile valide
- Compte développeur Zapier (pour le déploiement)

## 🛠️ Installation

1. **Cloner et installer les dépendances** :
   ```bash
   npm install
   ```

2. **Configuration de l'environnement** :
   Créez un fichier `.env` à la racine :
   ```env
   API_KEY=votre_cle_api_koncile_ici
   ```

3. **Exécution des tests** :
   ```bash
   npm test
   ```

4. **Commandes Zapier utiles** :
   ```bash
   # Enregistrer l'intégration sur Zapier
   zapier register "Koncile AI - Advanced OCR"

   # Ou lier à une intégration existante
   zapier link

   # Déployer sur Zapier
   zapier push
   ```

## 🔐 Authentification

Cette intégration utilise l'authentification par clé API :

1. **Obtenir votre clé API** :
   - Connectez-vous à [Koncile Dashboard](https://app.koncile.ai/dashboard/settings?tab=API)
   - Générez ou copiez une clé API existante
   - Collez-la lors de la configuration dans Zapier

2. **Test d'authentification** :
   - L'intégration vérifie automatiquement la validité de la clé
   - Endpoint de vérification : `POST /v1/check_api_key/`

## ⚡ Actions Disponibles

### 📤 Upload File (Téléchargement de Fichier)

Télécharge un fichier depuis une URL vers Koncile.ai pour traitement OCR.

**Champs obligatoires** :
- **📁 Folder** : Sélectionnez le dossier de destination dans votre compte Koncile
- **📋 Template** : Choisissez un template OCR pour le traitement
- **🔗 File URL** : URL du fichier à télécharger
- **📝 File Name** : Nom du fichier avec extension (ex: "facture.pdf")

**Réponse** :
```json
{
  "task_ids": [123, 456],
  "uploaded_file_url": "https://example.com/file.pdf",
  "uploaded_file_name": "facture.pdf"
}
```

### 📚 Resources Dynamiques

#### 📁 Liste des Dossiers
- **Endpoint** : `GET /v1/fetch_all_folders/`
- **Utilisation** : Dropdown dynamique pour sélectionner un dossier
- **Format** : `{id: "123", name: "Mon Dossier"}`

#### 📋 Liste des Templates
- **Endpoint** : `GET /v1/fetch_all_folders/` (filtrée par dossier)
- **Utilisation** : Dropdown dynamique basé sur le dossier sélectionné
- **Format** : `{id: "456", name: "Template Facture"}`

## 🏗️ Architecture

```
Koncile AI - Advanced OCR/
├── 📄 index.js              # Configuration principale de l'app
├── 📄 package.json          # Dépendances et métadonnées
├── 📄 authentication.js     # Logique d'authentification (optionnel)
├── 📄 hydrators.js          # Hydratation des données (optionnel)
├── 📁 creates/              # Actions de création
│   ├── uploadFile.js        # Action principale d'upload
│   ├── uploadFile_v9.js     # Version précédente
│   └── uploadFile_v10.js    # Version optimisée
├── 📁 resources/            # Resources dynamiques
│   ├── fetchFolders.js      # Récupération des dossiers
│   └── fetchTemplates.js    # Récupération des templates
├── 📁 test/                 # Suite de tests
│   ├── koncile.test.js      # Tests principaux
│   └── test.txt             # Données de test
└── 📁 build/                # Fichiers de build
    ├── build.zip            # Archive de build
    └── source.zip           # Archive source
```

## 🔧 Développement

### Ajouter une nouvelle action

1. **Créer le fichier d'action** dans `creates/` :
```javascript
const perform = async (z, bundle) => {
  // Votre logique ici
};

module.exports = {
  key: 'monAction',
  noun: 'Action',
  display: {
    label: 'Mon Action',
    description: 'Description de mon action'
  },
  operation: {
    inputFields: [/* vos champs */],
    perform
  }
};
```

2. **Enregistrer dans** `index.js` :
```javascript
const monAction = require('./creates/monAction');

module.exports = {
  // ...
  creates: {
    [monAction.key]: monAction,
  }
};
```

### Modifier une resource existante

Les resources se trouvent dans le dossier `resources/` et suivent le pattern :
```javascript
const perform = async (z, bundle) => {
  const response = await z.request({
    url: 'https://api.koncile.ai/v1/endpoint',
    headers: {
      Authorization: `Bearer ${bundle.authData.api_key}`
    }
  });

  return response.json.data.map(item => ({
    id: item.id.toString(),
    name: item.name
  }));
};
```

## 🧪 Tests

### Configuration des tests

Les tests utilisent Jest et requièrent une clé API valide :

```bash
# Variables d'environnement pour les tests
API_KEY=votre_cle_api_test
```

### Exécuter les tests

```bash
# Tous les tests
npm test

# Tests avec timeout étendu
jest --testTimeout 10000

# Tests en mode watch
jest --watch
```

### Tests disponibles

1. **Test d'authentification** : Vérifie la validité de la clé API
2. **Test d'upload** : Teste le téléchargement complet d'un fichier
3. **Tests unitaires** : Validation des fonctions individuelles

## 🌐 API Koncile.ai

### Endpoints utilisés

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| `POST` | `/v1/check_api_key/` | Vérification clé API | `Authorization: Bearer {api_key}` |
| `GET` | `/v1/fetch_all_folders/` | Liste des dossiers | `Authorization: Bearer {api_key}` |
| `POST` | `/v1/upload_file/` | Upload de fichier | `folder_id`, `template_id`, `files` |

### Exemple d'utilisation API

```javascript
const response = await z.request({
  url: 'https://api.koncile.ai/v1/upload_file/',
  method: 'POST',
  params: {
    folder_id: bundle.inputData.folder_id,
    template_id: bundle.inputData.template_id,
  },
  body: formData,
  headers: {
    Authorization: `Bearer ${bundle.authData.api_key}`
  }
});
```

## 🚀 Déploiement

### Build de l'intégration

```bash
# Créer l'archive de déploiement
zapier build

# Déployer sur Zapier
zapier push
```

### Variables d'environnement

```env
# Développement
API_KEY=dev_api_key_here

# Production
API_KEY=prod_api_key_here
```

## 🛡️ Sécurité

- ✅ Authentification par clé API sécurisée
- ✅ Validation des entrées utilisateur
- ✅ Gestion d'erreurs robuste
- ✅ Timeout configurables pour les requêtes
- ✅ Logs d'audit automatiques

## 🐛 Dépannage

### Erreurs communes

1. **Erreur d'authentification** :
   ```
   Error: File upload failed: 401
   ```
   - Vérifiez que votre clé API est valide
   - Assurez-vous qu'elle n'a pas expiré

2. **Fichier non trouvé** :
   ```
   Error: File upload failed: 404
   ```
   - Vérifiez que l'URL du fichier est accessible
   - Confirmez que le dossier/template existe

3. **Timeout de requête** :
   ```
   Error: Request timeout
   ```
   - Fichier trop volumineux
   - Connexion réseau instable

### Logs et monitoring

Les logs Zapier incluent :
- Détails des requêtes API
- Temps de réponse
- Erreurs avec stack traces
- Métadonnées des fichiers traités

## 📞 Support

### Ressources

- 📖 [Documentation Koncile.ai](https://docs.koncile.ai)
- 🔧 [Dashboard Koncile](https://app.koncile.ai/dashboard)
- 💬 [Support Zapier](https://zapier.com/help)
- 📚 [Documentation Zapier Platform](https://github.com/zapier/zapier-platform/blob/main/packages/cli/README.md)

### Contact

Pour les problèmes spécifiques à cette intégration :

1. Vérifiez que votre clé API est active
2. Testez l'accès aux URLs de fichiers
3. Confirmez l'existence des dossiers/templates
4. Consultez les logs Zapier pour plus de détails

---

**Version** : 1.1.0
**Plateforme Zapier** : 16.3.1
**Node.js** : 14+

*Cette intégration est maintenue par l'équipe Koncile.ai*
