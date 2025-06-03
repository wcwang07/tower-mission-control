# Tower Mission Control

A real-time mission control dashboard for managing telecom tower-device-app-action matrices, enterprise policies, and device event monitoring.

## 📦 Components

* **Backend**: Vert.x Kafka WebSocket event bridge
* **Frontend**: React + Tailwind dashboard UI with real-time updates via WebSocket
* **Kafka**: Powers the pub-sub event stream
* **Zookeeper**: Kafka coordination

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/wcwang07/tower-mission-control.git
cd tower-mission-control
```

### 2. Run with Docker Compose

```bash
cd tower-mission-control
cd backend
mvn clean package
docker-compose up --build
```

### 3. Start Dashboard

```bash
cd tower-mission-control
cd frontend
npm install
npm run dev
```

### 4. Access the Dashboard

Open in browser: [http://localhost:3000](http://localhost:3000)

### 5. Push Sample Events to Kafka

Open a terminal inside the Kafka container:

```bash
docker exec -it kafka bash
```

Run the Kafka console producer:

```bash
kafka-console-producer \
  --broker-list localhost:9092 \
  --topic tower-events
```

Paste the following JSON events (each line is one event):

```json
{"towerId":"tower-003","device":"iPad","os":"iOS","app":"YouTube","action":"play","meta":{"ip":"10.2.1.3","lastSeen":"2025-06-02T22:15:00Z"}}
{"towerId":"tower-001","device":"iPhone 13","os":"iOS","app":"Spotify","action":"stream","meta":{"ip":"10.0.0.1","lastSeen":"2025-06-03T15:01:00Z"}}
{"towerId":"tower-001","device":"Galaxy S21","os":"Android","app":"YouTube","action":"play","meta":{"ip":"10.0.0.2","lastSeen":"2025-06-03T15:02:00Z"}}
{"towerId":"tower-002","device":"Pixel 7","os":"Android","app":"Slack","action":"message","meta":{"ip":"10.0.0.3","lastSeen":"2025-06-03T15:03:00Z"}}
{"towerId":"tower-002","device":"iPad Pro","os":"iOS","app":"Teams","action":"call","meta":{"ip":"10.0.0.4","lastSeen":"2025-06-03T15:04:00Z"}}
{"towerId":"tower-003","device":"OnePlus 10","os":"Android","app":"Zoom","action":"call","meta":{"ip":"10.0.0.5","lastSeen":"2025-06-03T15:05:00Z"}}
{"towerId":"tower-003","device":"MacBook Air","os":"macOS","app":"Chrome","action":"browse","meta":{"ip":"10.0.0.6","lastSeen":"2025-06-03T15:06:00Z"}}
{"towerId":"tower-004","device":"Dell XPS","os":"Windows","app":"Outlook","action":"email","meta":{"ip":"10.0.0.7","lastSeen":"2025-06-03T15:07:00Z"}}
{"towerId":"tower-004","device":"Surface Pro","os":"Windows","app":"Edge","action":"browse","meta":{"ip":"10.0.0.8","lastSeen":"2025-06-03T15:08:00Z"}}
{"towerId":"tower-005","device":"iPhone SE","os":"iOS","app":"Facebook","action":"scroll","meta":{"ip":"10.0.0.9","lastSeen":"2025-06-03T15:09:00Z"}}
{"towerId":"tower-005","device":"Moto G Power","os":"Android","app":"Instagram","action":"post","meta":{"ip":"10.0.0.10","lastSeen":"2025-06-03T15:10:00Z"}}
```

You should now see real-time updates streaming into the dashboard!

---

## 📡 WebSocket Endpoint

* URL: `ws://localhost:8080/tower-stream`
* Used by frontend React client to receive real-time tower events

## 📁 Directory Structure

```
tower-mission-control/
├── backend/                # Vert.x Kafka WS backend
├── frontend/               # React dashboard client
├── docker-compose.yml     # Full-stack container setup
└── README.md
```

---

## 🧠 Example Use Case

An enterprise wants to:

* View real-time app usage across towers
* Enforce action-based policies based on user role
* Flag and remediate violations automatically

---

Need help setting up a policy model or Flink enrichment layer next? Just ask. 😎
