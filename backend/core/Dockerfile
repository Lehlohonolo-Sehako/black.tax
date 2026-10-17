# Build context: repository root (the OpenAPI contract in api/ is an input to the build).
FROM eclipse-temurin:21-jdk AS build
WORKDIR /src
COPY api ./api
COPY backend/core ./backend/core
WORKDIR /src/backend/core
RUN ./mvnw -ntp -Pprod -DskipTests -Dmodernizer.skip -Dcheckstyle.skip package && cp target/core-*.jar /app.jar

FROM eclipse-temurin:21-jre
COPY --from=build /app.jar /app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
