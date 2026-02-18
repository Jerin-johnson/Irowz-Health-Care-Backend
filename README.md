# HealthCare SaaS - Patient-First Platform

A scalable healthcare SaaS platform designed to eliminate patient wait times. Patients book appointments instantly, access lab reports immediately, and connect with doctors via video—all secured with role-based access control (RBAC).

## ✨ **Key Features**

- **4 Role System**: Patient - Doctor - Hospital Admin - Super Admin
- **Zero Wait Times**: Instant booking, real-time updates, immediate lab results
- **Video Consultations**: ZegoCloud-powered HD calls
- **Clean Architecture**: SOLID principles, TypeScript, easily extensible
- **Real-time Everything**: Socket.io + Redis Pub/Sub + BullMQ queues

## 🏗️ **Tech Stack**

```
Frontend: React + TypeScript + Vite (port 5173)
Backend:  Node.js + TypeScript + Express
Database: MongoDB + Redis
Queue:    BullMQ
Realtime: Socket.io + Redis Pub/Sub
Video:    ZegoCloud
Infra:    Docker + AWS S3
Payment:  Razorpay
Auth:     JWT (Access/Refresh tokens)
Email:    SMTP
AI:       Google Gemini + Pinecone Vector DB
```

## 🚀 **Quick Start**

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- MongoDB Atlas or local instance
- Redis Cloud or local
- AWS S3 buckets
- ZegoCloud account

### Clone & Install

```bash
git clone <your-repo>
cd Irowz-Health-Care-Backend
cp .env.example .env
# Fill .env with your credentials
npm install
```

### Development

```bash
# Backend
npm run dev

# Frontend (separate terminal)
cd client
npm install
npm run dev
```

### Docker (Production-Ready)

```bash
docker-compose up -d
# Visit http://localhost:3000
```

## 📋 **Environment Setup**

Copy `.env.example` to `.env` and fill:

```
PORT=3000
MONGO_URI=your_connection_string
REDIS_HOST=your_redis_host
ZEGO_APP_ID=your_zego_id
AWS_ACCESS_KEY_ID=your_key
RAZORPAY_KEY_ID=your_key
```

```



## 📈 **Scalability Features**

- **Redis Pub/Sub**: Real-time across services
- **BullMQ**: Background jobs (emails, reports)
- **Docker**: Containerized, easy deploy
- **TypeScript**: Type-safe, fewer bugs
- **Modular**: Add new roles/features easily

## 🤝 **Contributing**

1. Fork the repo
2. Create feature branch: `git checkout -b feature/patient-notifications`
3. Commit: `git commit -m "feat: add patient push notifications"`
4. Push: `git push origin feature/patient-notifications`
5. Open Pull Request

**Commit Format**: Follow [Conventional Commits](https://www.conventionalcommits.org/)

```

feat: add patient dashboard
fix: resolve video call disconnects
docs: update README setup
ci: update docker build

``

_Built with ❤️ for patients tired of waiting_

```

```
