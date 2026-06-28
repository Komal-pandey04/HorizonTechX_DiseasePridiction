# 🏥 MediPredict AI v2.0

> Full-stack AI healthcare platform — Heart Disease · Diabetes · Breast Cancer

## ✅ Quick Start

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
# Models are pre-trained. To retrain:
# python training/train_models.py
uvicorn main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## 📁 Structure
```
medipredict/
├── backend/
│   ├── main.py                    FastAPI app
│   ├── requirements.txt
│   ├── database/database.py       SQLAlchemy + SQLite
│   ├── routes/api.py              REST endpoints
│   ├── schemas/schemas.py         Pydantic models
│   ├── services/predictor.py      ML inference + feature importance
│   ├── training/train_models.py   Full ML pipeline
│   ├── datasets/raw/              3 clinical datasets
│   └── saved_models/              .pkl files + metrics.json
└── frontend/src/
    ├── App.jsx
    ├── components/  Navbar, Sidebar, Footer, Chatbot
    ├── pages/       Home, Predict, Dashboard, History, About
    └── services/api.js
```

## 🤖 Models
| Disease | Dataset | Best Model | AUC |
|---|---|---|---|
| Heart Disease | UCI Cleveland | Random Forest | 94.6% |
| Diabetes | Pima Indians | Random Forest | 81.8% |
| Breast Cancer | Wisconsin | Logistic Regression | 99.6% |

## 📡 API
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/predict/heart` | Heart disease prediction |
| POST | `/predict/diabetes` | Diabetes prediction |
| POST | `/predict/breast` | Breast cancer prediction |
| GET | `/history` | All prediction records |
| DELETE | `/history/{id}` | Delete a record |
| GET | `/metrics` | Model performance data |
| GET | `/stats` | Prediction statistics |
| GET | `/docs` | Interactive Swagger UI |

> ⚠️ For educational purposes only. Not a substitute for medical advice.
