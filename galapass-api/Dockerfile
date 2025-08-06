# STAGE 1: Build the application using Maven
FROM openjdk:21-jdk as builder
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw .
COPY pom.xml .
COPY src ./src

# --- ADD THIS LINE ---
# Give the maven wrapper execute permissions
RUN chmod +x mvnw

# Run the Maven build command to create the .jar
RUN ./mvnw package -DskipTests


# STAGE 2: Create the final, lightweight image
FROM openjdk:21-jdk-slim
WORKDIR /app

# Copy the .jar file that was created in the 'builder' stage
COPY --from=builder /app/target/galapass-api-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]