# Usa una imagen base con Java 25
FROM eclipse-temurin:25-jdk-alpine

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo JAR generado por Maven
COPY target/*.jar app.jar

# Expone el puerto que usa tu aplicación
EXPOSE 8080

# Comando para ejecutar la app
ENTRYPOINT ["java", "-jar", "app.jar"]
