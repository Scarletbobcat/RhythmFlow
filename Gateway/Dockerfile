FROM openjdk:21-jdk-slim
WORKDIR /opt
ENV PORT=8080
ENV JWT_SECRET=${JWT_SECRET}
EXPOSE 8080
COPY target/*.jar /opt/app.jar
ENTRYPOINT exec java $JAVA_OPTS -jar app.jar