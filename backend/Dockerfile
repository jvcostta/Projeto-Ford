# Use a imagem base do OpenJDK
FROM openjdk:17-jdk-slim

WORKDIR /app

# Instalar Maven e curl
RUN apt-get update && \
    apt-get install -y maven curl && \
    rm -rf /var/lib/apt/lists/*

# Copiar arquivos do projeto
COPY . .

# Construir o projeto
RUN mvn clean package -DskipTests

# Mover o JAR para um local padrão
RUN mv target/*.jar app.jar

# Criar usuário não-root
RUN addgroup --system ford && adduser --system --group ford
USER ford

# Expor porta
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Executar aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
