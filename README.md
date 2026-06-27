# ChatNest — Real-Time Full-Stack Chat Application

![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

A production-grade real-time messaging platform with rooms, DMs, file sharing, and presence indicators. Think Slack-lite — built entirely from scratch.

## ✨ Features

- **Real-Time Messaging** — Sub-100ms message delivery with Socket.io
- **Channels & DMs** — Public/private channels and 1-on-1 direct messages
- **Typing Indicators** — Live "User is typing..." with debouncing
- **Presence System** — Online/away/offline status with Redis Pub/Sub
- **File Sharing** — Image/file uploads stored in Cloudinary
- **Message History** — Paginated scroll-back with infinite loading
- **Read Receipts** — Per-user read status tracking
- **Emoji Reactions** — React to messages with emoji picker
- **JWT Auth** — Stateless authentication with refresh tokens
- **Notifications** — Browser push notifications for mentions

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| State | Zustand (client) + React Query (server state) |
| Real-time | Socket.io (WebSocket) |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| Cache/Pub-Sub | Redis |
| Auth | JWT (access + refresh tokens) |
| File Storage | Cloudinary |
| Deployment | Railway (backend) + Vercel (frontend) |

## 📁 Project Structure

```
chatnest/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── MessageList.tsx
│   │   │   │   ├── MessageInput.tsx
│   │   │   │   ├── ChannelSidebar.tsx
│   │   │   │   └── UserPresence.tsx
│   │   │   └── ui/
│   │   ├── hooks/
│   │   │   ├── useSocket.ts
│   │   │   ├── useMessages.ts
│   │   │   └── usePresence.ts
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   └── chatStore.ts
│   │   └── App.tsx
│   └── vite.config.ts
└── server/
    ├── src/
    │   ├── controllers/
    │   ├── models/
    │   │   ├── User.ts
    │   │   ├── Message.ts
    │   │   └── Channel.ts
    │   ├── routes/
    │   ├── middleware/
    │   │   └── auth.ts
    │   ├── socket/
    │   │   └── handlers.ts
    │   └── index.ts
    └── tsconfig.json
```

## 🚀 Getting Started

```bash
git clone https://github.com/Tanvin01/chatnest.git
cd chatnest
npm install
```

### Environment Variables

```env
# Server
PORT=4000
MONGODB_URI=mongodb://localhost:27017/chatnest
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# Client
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
```

```bash
# Start MongoDB and Redis, then:
npm run dev
```

## 🏗 Architecture

### Socket Event Map

```
Client → Server           Server → Client
─────────────────         ────────────────────
join_channel          →   message_new
send_message          →   message_updated
typing_start          →   typing_indicator
typing_stop           →   user_presence_change
mark_read             →   read_receipt
                      →   notification
```

### Redis Usage

- **Pub/Sub** — broadcasts presence changes across multiple server instances
- **Cache** — online user sets (`SET chatnest:online:{userId}`)
- **Rate limiting** — sliding window counters per user

## ⚡ Performance Optimizations

- **Message pagination** — cursor-based, not offset (consistent under writes)
- **Connection pooling** — MongoDB connection reuse across hot-reloads
- **Debounced typing** — 300ms debounce on typing_start events
- **Virtual scrolling** — only renders visible messages in large channels
