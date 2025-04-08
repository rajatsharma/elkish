# Elkish

> 🚀 Example Express service with logging powered by ELK Stack 📊

A simple Express application built with TypeScript and integrated with the ELK (Elasticsearch, Logstash, Kibana) stack for advanced logging and monitoring. All containerized with Docker for easy deployment! 🐳

## ✨ Features

- 📝 **Pino Logger** - High-performance JSON logging
- 🔍 **ELK Stack Integration** - Powerful log aggregation and visualization
- 🐳 **Docker & Docker Compose** - Simple containerized deployment
- 🌐 **Express API** - Clean REST API structure
- 🔄 **Request ID Tracking** - UUID generation for request tracing
- 🛡️ **Error Handling** - Consistent error responses and logging
- 🔄 **Graceful Shutdown** - Proper process termination

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Usage

- Start the application with Docker Compose

```bash
docker-compose up --build
```

- Access the services:
    - Node.js API: http://localhost:3000
    - Kibana: http://localhost:5601
    - Elasticsearch: http://localhost:9200

## 🔌 API Endpoints

| Method | Endpoint      | Description                  |
|--------|---------------|------------------------------|
| GET    | /             | Root endpoint                |
| GET    | /health       | Health check with timestamp  |
| GET    | /error        | Simulates an error response  |
| GET    | /users/:id    | User lookup by ID            |

## 📊 Logging

This project uses Pino for structured JSON logging with the following features:

- 🆔 Request ID generation and tracking
- 📝 HTTP request/response logging via pino-http
- 📊 Integration with ELK stack for visualization
- 🔄 Log level automation based on response status
- 🔍 Selective serialization of request data

## 🧩 ELK Stack Configuration

### Elasticsearch
- Single-node setup for development
- Data persistence through Docker volumes
- Accessible on port 9200

### Logstash
- Custom pipeline for log processing
- JSON parsing and field extraction
- Log categorization with tags
- Accessible on ports 5000 (TCP) and 5044 (HTTP)

### Kibana
- Web UI for log visualization and analysis
- Index pattern creation for node-app-logs-*
- Accessible on port 5601

## 🛠️ Development

For local development without Docker:

1. Install dependencies
```bash
cd service
pnpm install
```

2. Run in development mode
```bash
pnpm run dev
```

3. Build TypeScript
```bash
pnpm run build
```

4. Run built application
```bash
pnpm start
```

## 🧪 Testing with cURL

```bash
# Basic request
curl http://localhost:3000/

# Health check
curl http://localhost:3000/health

# Simulate error
curl http://localhost:3000/error

# User lookup
curl http://localhost:3000/users/123
```

## 📋 Environment Variables

| Variable  | Description                | Default     |
|-----------|----------------------------|-------------|
| PORT      | Port for the Node.js app   | 3000        |
| LOG_LEVEL | Pino log level             | info        |
| NODE_ENV  | Environment                | development |

## 🔧 Customization

- Modify `logstash/pipeline/logstash.conf` to adjust log parsing
- Update `src/logger.ts` to change logging behavior
- Edit Docker Compose for different resource allocations

## 🔒 Security Notes

- This setup is designed for development
- For production, add proper security configurations:
    - Enable Elasticsearch authentication
    - Add network isolation
    - Implement proper secrets management

## 📚 Learning Resources

- [Pino Logger Documentation](https://getpino.io/)
- [Elasticsearch Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
- [Logstash Documentation](https://www.elastic.co/guide/en/logstash/current/index.html)
- [Kibana Documentation](https://www.elastic.co/guide/en/kibana/current/index.html)
