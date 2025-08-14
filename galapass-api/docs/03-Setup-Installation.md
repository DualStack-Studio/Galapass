# 🚀 Instalación y Configuración

*Tags: #setup #installation #configuration #development #backend*

## 📋 Requisitos del Sistema

### 💻 Requisitos Mínimos

* **Java**: JDK 17+ (recomendado OpenJDK 21)
* **Memoria RAM**: 4GB mínimo, 8GB recomendado
* **Espacio en Disco**: 2GB para dependencias y builds
* **OS**: Linux, macOS, Windows (con WSL2 recomendado)

### 🛠️ Herramientas Necesarias

* **Git**: Para clonar el repositorio
* **Maven**: 3.8+ (o usar wrapper incluido)
* **Docker & Docker Compose**: Para contenedores y base de datos
* **IDE**: IntelliJ IDEA, VS Code, o similar

### 🌐 Servicios Externos

* **PostgreSQL Database**: Para persistencia de datos
* **Cloudinary**: Opcional, para almacenamiento de imágenes

## 📥 Instalación Paso a Paso

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/DualStack-Studio/Galapass
cd galapass-backend
```

### 2️⃣ Verificar Java

```bash
java -version
# Debe mostrar Java 17+ o 21+
```

#### Instalar OpenJDK 21 (si es necesario)

##### Ubuntu/Debian:

```bash
sudo apt update
sudo apt install openjdk-21-jdk
```

##### macOS (Homebrew):

```bash
brew install openjdk@21
```

##### Windows:

* Descargar desde [Microsoft](https://learn.microsoft.com/en-us/java/openjdk/download)
* O usar chocolatey: `choco install openjdk21`

## ⚙️ Configuración del Proyecto

### 🔧 Variables de Entorno

```bash
cp .env.example .env
nano .env
```

Contenido mínimo del `.env`:

```env
DB_URL=jdbc:postgresql://localhost:5432/galapass_db
DB_USER=galapass_user
DB_PASSWORD=galapass_password
SPRING_PROFILES_ACTIVE=prod
SECRET_KEY=tu_clave_secreta
CLOUD_NAME=tu_cloud_name
CLOUD_API_KEY=tu_api_key
CLOUD_SECRET=tu_api_secret
```

## 🏃‍♂️ Ejecutar la Aplicación

### 🛠️ Modo Desarrollo

#### Opción 1: Maven

```bash
mvn clean package -DskipTests
java -jar target/galapass-0.1.0.jar
```

#### Opción 2: Docker Compose
#### El .env deberá estár en la carpeta raíz del proyecto (.env.example)

```bash
docker compose --env-file .env up -d --build
```

## 🔧 Configuraciones Avanzadas

### 🐳 Docker Setup (Opcional)

#### Dockerfile

```dockerfile
FROM openjdk:21-jre-slim
WORKDIR /app
COPY target/galapass-0.1.0.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

#### Docker Compose completo

```yaml
version: '3.8'
services:
  galapass:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: galapass
    restart: always
    environment:
      SPRING_DATASOURCE_URL: ${DB_URL}
      SPRING_DATASOURCE_USERNAME: ${DB_USER}
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE}
    depends_on:
      - postgres
    networks:
      - galanet

  postgres:
    image: postgres:17
    container_name: galapass-postgres
    restart: always
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - galanet

  nginx:
    image: nginx:stable
    container_name: galapass-nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - galapass
    networks:
      - galanet

networks:
  galanet:

volumes:
  postgres_data:
```

#### Nginx default.conf

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://galapass:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## ✅ Verificar Instalación

```bash
curl http://localhost/actuator/health
```

Esperado:

```json
{
  "status": "UP"
}
```

## 🚀 Deploy en Render

1. Subir repo a GitHub con `.env.example`
2. Crear servicio en Render → Tipo: Docker
3. Configurar variables de entorno con los valores reales
4. Render construye la imagen y despliega automáticamente

## 🛠 Troubleshooting

* **Error: Could not connect to database**

    * Verificar que PostgreSQL está ejecutándose (`docker ps | grep postgres`)
    * Conectar con `psql -h localhost -U galapass_user -d galapass_db`

* **Error: Port 8080 already in use**

    * `lsof -i :8080`
    * `kill -9 <PID>`

* **Variables de entorno no cargadas**

    * Revisar que `.env` exista y tenga el formato correcto
    * Revisar `docker-compose.yml` env\_file

## 🔗 Enlaces Útiles

* [Spring Boot](https://spring.io/projects/spring-boot)
* [PostgreSQL](https://www.postgresql.org/docs/)
* [Docker](https://docs.docker.com/)
* [Render](https://render.com/docs)

---

*Última actualización: 2025-08-14*
*Versión del documento: 1.0*
