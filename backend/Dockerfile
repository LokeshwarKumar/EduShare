# Use Eclipse Temurin 17 JRE Alpine
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy jar file
COPY target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
