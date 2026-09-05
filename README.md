# Asclepius - Skin Cancer Detection System

**Asclepius** adalah aplikasi berbasis Machine Learning (ML) untuk melakukan deteksi dini kanker kulit berdasarkan gambar. Proyek ini terdiri dari dua komponen utama: **Backend API** berbasis Express.js dan TensorFlow.js (di-deploy ke **Google Cloud Run**) serta **Frontend App** dengan antarmuka web statis (**Google App Engine**). Seluruh riwayat prediksi disimpan pada database **Google Cloud Firestore**.

---

## Technical Specifications

* **GCP Project ID**: `submissionmlgc-rnlkav`
* **Region**: `asia-southeast2` (Jakarta)
* **ML Model**: TensorFlow.js Graph Model (`https://storage.googleapis.com/submissionmlgc-models/model.json`)
* **Backend Stack**: Node.js, Express.js, `@tensorflow/tfjs-node`, Firestore Client
* **Frontend Stack**: Native HTML5, CSS3, JavaScript (ES6 Modules)

---

## Project Structure

```text
.
├── asclepius-be/          # Express.js Backend API
│   ├── src/
│   │   ├── controllers/   # Request & Response Handlers
│   │   ├── middlewares/   # Multer File Handling & Global Error Handler
│   │   ├── routes/        # API Endpoints Router
│   │   ├── services/      # TensorFlow.js Inference & Firestore DB Layer
│   │   └── server.js      # Server Entry Point & Health Check
│   ├── Dockerfile
│   └── package.json
└── asclepius-fe/          # Web Frontend Static App
    ├── src/               # Scripts, Styles, & Images Assets
    ├── app.yaml           # App Engine Static Routing Configuration
    └── index.html
```

## API Endpoints Summary

| Method | Endpoint             | Description                                                       |
| ------ | -------------------- | ----------------------------------------------------------------- |
| GET    | `/`                  | Health check backend service status                               |
| POST   | `/predict`           | Memproses gambar (maks. 1 MB) dan mengembalikan hasil prediksi ML |
| GET    | `/predict/histories` | Mengambil seluruh riwayat prediksi, terurut dari yang terbaru     |


## Permission

```bash
gcloud services enable \
  run.googleapis.com \
  appengine.googleapis.com \
  firestore.googleapis.com \
  storage.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  iam.googleapis.com
```

## Backend Deployment (Cloud Run)

1. Inisialisasi Database Firestore

    Pastikan database Firestore Native Mode sudah dikonfigurasi:

    ```bash
    gcloud firestore databases create \
    --location=asia-southeast2 \
    --type=firestore-native

    gcloud firestore databases list
    ```
2. Deploy ke Cloud Run

    - Option A: Menggunakan Cloud Build (Container Image)

        ```bash
        cd ~/asclepius-be
        gcloud builds submit --tag gcr.io/submissionmlgc-rnlkav/backend-api

        gcloud run deploy backend-api \
        --image gcr.io/submissionmlgc-rnlkav/backend-api \
        --platform managed \
        --region asia-southeast2 \
        --allow-unauthenticated \
        --set-env-vars MODEL_URL=https://storage.googleapis.com/submissionmlgc-models/model.json,GCP_PROJECT_ID=submissionmlgc-rnlkav

        ```
    - Option B: Deploy Langsung dari Source Code (Buildpack/Dockerfile)

        ```bash
        cd ~/asclepius-be
        gcloud run deploy backend-api \
        --source . \
        --platform managed \
        --region asia-southeast2 \
        --allow-unauthenticated \
        --set-env-vars MODEL_URL=https://storage.googleapis.com/submissionmlgc-models/model.json,GCP_PROJECT_ID=submissionmlgc-rnlkav

        ```


## Frontend Deployment (App Engine)

1. berkas asclepius-fe/src/scripts/api.js sudah diisi dengan Service URL Cloud Run milik backend.
2. deployment aplikasi web ke App Engine Standard:

    ```bash
    cd ~/asclepius-fe
    gcloud app deploy

    ```

## Auditor Access Privilege Management (IAM Roles)

   Hak akses read-only & auditing kepada Auditor Eksternal sesuai kebutuhan resource yang digunakan:

    ```bash
    AUDITOR_EMAIL="reviewer_googlecloud@dicoding.com"

    # Akses Read-Only Data Firestore
    gcloud projects add-iam-policy-binding submissionmlgc-rnlkav \
    --member="group:$AUDITOR_EMAIL" \
    --role="roles/datastore.viewer"

    # Akses Read-Only Model di Cloud Storage
    gcloud projects add-iam-policy-binding submissionmlgc-rnlkav \
    --member="group:$AUDITOR_EMAIL" \
    --role="roles/storage.objectViewer"

    # Akses Audit Keamanan & Kebijakan IAM
    gcloud projects add-iam-policy-binding submissionmlgc-rnlkav \
    --member="group:$AUDITOR_EMAIL" \
    --role="roles/iam.securityReviewer"

    # Akses Read-Only & Source Code App Engine
    gcloud projects add-iam-policy-binding submissionmlgc-rnlkav \
    --member="group:$AUDITOR_EMAIL" \
    --role="roles/appengine.codeViewer"

    # Akses Read-Only App Engine
    gcloud projects add-iam-policy-binding submissionmlgc-rnlkav \
    --member="user:$AUDITOR_EMAIL" \
    --role="roles/appengine.appViewer"

    # Akses Read-Only Log & Status Cloud Build
    gcloud projects add-iam-policy-binding submissionmlgc-rnlkav \
    --member="group:$AUDITOR_EMAIL" \
    --role="roles/cloudbuild.builds.viewer"

    # Akses Read-Only Service & Configuration Cloud Run
    gcloud projects add-iam-policy-binding submissionmlgc-rnlkav \
    --member="group:$AUDITOR_EMAIL" \
    --role="roles/run.viewer"

    ```