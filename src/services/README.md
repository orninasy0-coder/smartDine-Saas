# Services Directory

This directory contains shared service modules for API communication and business logic.

## Structure

```
services/
├── api/              # API client configuration
├── auth/             # Authentication services
├── storage/          # Local/session storage utilities
├── websocket/        # WebSocket connection management
└── notifications/    # Notification services
```

## Service Pattern

Services handle:

- API communication
- Data transformation
- Error handling
- Caching logic
- Business logic that spans multiple features
