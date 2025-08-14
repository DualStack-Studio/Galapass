# 🏗️ Arquitectura Técnica - Galapass

*Tags: #architecture #springboot #react #design #backend #frontend #galapass* 

## 🎯 Visión Arquitectónica

El backend de **Galapass** sigue una arquitectura hexagonal (Clean Architecture) implementada con **Spring Boot**, diseñada para ser escalable, mantenible y testeable.
El frontend en React.js consume la API REST y se encarga de la interfaz de usuarios, guías y propietarios.

## 🏛️ Diagrama de Arquitectura General
```
graph TB
    subgraph "Frontend"
        Client[React.js Client]
    end
    
    subgraph "Backend"
        subgraph "Controllers Layer"
            RestAPI[REST Controllers]
            Security[Security Filters JWT]
        end
        
        subgraph "Service Layer"
            UserService[User Service]
            TourService[Tour Service]
            BookingService[Booking Service]
            AuthService[Auth Service]
        end
        
        subgraph "Repository Layer"
            UserRepo[User Repository]
            TourRepo[Tour Repository]
            BookingRepo[Booking Repository]
            JPA[JPA/Hibernate]
        end
        
        subgraph "Configuration"
            Config[Application Config]
            SecurityConfig[Security Config]
            Database[Database Config]
        end
    end
    
    Client --> RestAPI
    RestAPI --> Security
    Security --> AuthService
    RestAPI --> UserService
    RestAPI --> TourService
    RestAPI --> BookingService
    UserService --> UserRepo
    TourService --> TourRepo
    BookingService --> BookingRepo
    UserRepo --> JPA
    TourRepo --> JPA
    BookingRepo --> JPA
    JPA --> DB[(PostgreSQL)]
    Config --> SecurityConfig
    Config --> Database

```

## 🔧 Stack Tecnológico Detallado
### 🚀 Backend - Spring Boot (Java 21, Maven)

#### Características Clave
- **Inyección de Dependencias:** Con Spring @Autowired
- **REST API:** Endpoints versionados y claros
- **Seguridad JWT:** Autenticación stateless y roles
- **Escalable y mantenible:** Clean Architecture, capas bien separadas

### Dependencias principales (pom.xml)
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>com.cloudinary</groupId>
    <artifactId>cloudinary-http44</artifactId>
    <version>1.38.0</version>
</dependency>
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.38</version>
    <scope>provided</scope>
</dependency>
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
<dependency>
    <groupId>io.swagger.core.v3</groupId>
    <artifactId>swagger-annotations</artifactId>
    <version>2.2.30</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>com.google.api-client</groupId>
    <artifactId>google-api-client</artifactId>
    <version>2.0.0</version>
</dependency>
<dependency>
    <groupId>com.google.http-client</groupId>
    <artifactId>google-http-client-jackson2</artifactId>
    <version>1.41.5</version>
</dependency>
```

## 🗄️Capa de Datos
### PostgreSQL
```yaml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

## 🔐 Seguridad y Autenticación
### JWT
- Tokens firmados y verificados en cada request
- Roles: TURISTA, GUÍA, PROPIETARIO, ADMIN
- OAuth2 (Google)
- Login/Registro con cuenta Google

## 📂 Estructura del Backend

```
src/main/java/com/galapass/
├── auth/ # Autenticación y autorización
│ ├── controller
│ ├── DTO
│ └── service
├── booking/ # Gestión de reservas
│ ├── controller
│ ├── DTO
│ ├── entity
│ ├── mapper
│ ├── repository
│ ├── service
│ └── specification
├── config/ # Configuraciones globales
├── enums/ # Enumeraciones del sistema
│ ├── controller
│ ├── DTO
│ ├── entity
│ └── service
├── exception/ # Manejo de excepciones
├── jwt/ # Seguridad y manejo de tokens
│ ├── controller
│ ├── DTO
│ ├── entity
│ └── service
├── media/ # Gestión de archivos multimedia
│ ├── controller
│ ├── DTO
│ ├── entity
│ └── service
├── tip/ # Información de consejos y tips
│ ├── controller
│ ├── entity
│ ├── repository
│ └── service
├── tour/ # Gestión de tours
│ ├── controller
│ ├── DTO
│ ├── entity
│ ├── mapper
│ ├── repository
│ └── service
├── user/ # Gestión de usuarios
├── controller
├── DTO
├── entity
├── mapper
├── repository
└── service
```

## 🔄 Patrones de Diseño Implementados

- **Repository Pattern:** Separación de persistencia
- **Service Layer Pattern:** Lógica de negocio centralizada
- **DTO Pattern:** Evita exponer entidades directamente
- **Exception Handling:** Manejo global con @ControllerAdvice

## 🌐 API Design (Estructura Base)
```
/api/v1/
├── /auth
│   ├── POST /login
│   ├── POST /logout
│   └── POST /refresh
├── /users
│   ├── GET /, POST /, GET /{id}, PUT /{id}, DELETE /{id}
├── /tours
│   ├── GET /, POST /, GET /{id}, PUT /{id}, DELETE /{id}
├── /bookings
│   ├── GET /, POST /, GET /{id}, PUT /{id}, DELETE /{id}
└── /admin
    ├── GET /stats
    └── GET /health
```

## Códigos de Estado HTTP

- **200** OK, **201** Created, **204** No Content
- **400** Bad Request, **401** Unauthorized, **403** Forbidden, **404** Not Found, **409** Conflict
- **500** Internal Server Error, **503** Service Unavailable

## 🚀 Performance y Escalabilidad

- **Connection Pooling:** HikariCP
- **Lazy Loading:** Entidades relacionadas
- **Pagination:** Para consultas largas
- **Caching:** Preparado para Redis

## 🔒 Seguridad

- JWT en cada request
- Roles y permisos
- Validación OAuth2 con Google
- CORS configurado para frontend React.js

---
*Última actualización: 2025-08-14*
*Versión del documento: 1.0*
