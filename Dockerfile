# Etapa 1: Maven compila el proyecto y genera el .jar
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn -B -DskipTests package

# Etapa 2: ejecuta el .jar ya construido
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/vacante-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
