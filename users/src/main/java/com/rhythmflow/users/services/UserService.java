package com.rhythmflow.users.services;

import com.rhythmflow.users.dtos.LoggingEvent;
import com.rhythmflow.users.entities.User;
import com.rhythmflow.users.enums.LogLevel;
import com.rhythmflow.users.repositories.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Service
public class UserService {

    @Value("${rabbitmq.logging.queue}")
    private String LOGGING_QUEUE_NAME;

    @Value("${rabbitmq.users.queue}")
    private String USERS_QUEUE_NAME;

    @Value("${spring.application.name}")
    private String APPLICATION_NAME;

     @Value("${supabase.serviceRoleKey}")
     private String SUPABASE_SERVICE_ROLE_KEY;

    @Value("${supabase.url}")
    private String SUPABASE_URL;

    private final UserRepository userRepository;

    private final RabbitTemplate rabbitTemplate;



    public UserService(UserRepository userRepository, RabbitTemplate rabbitTemplate) {
        this.userRepository = userRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User findUserById(String id) {
        return userRepository.findById(UUID.fromString(id)).orElse(null);
    }

    public void createUser(User user) {
        userRepository.save(user);
    }

    public boolean deleteUser(String requestUserId, String id) {
        boolean result = false;
        if (!Objects.equals(requestUserId, id)) {
            logEvent(LogLevel.ERROR, "User not allowed to delete", requestUserId);
            return result;
        }
        try {
            RestTemplate directRestTemplate = new RestTemplate();

            String url = SUPABASE_URL + "/auth/v1/admin/users/" + id;

            URI uri = new URI(url);

            HttpHeaders headers = new HttpHeaders();
            headers.set("apikey", SUPABASE_SERVICE_ROLE_KEY);
            headers.set("Authorization", "Bearer " + SUPABASE_SERVICE_ROLE_KEY);
            headers.set("Content-Type", "application/json");

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<Void> response = directRestTemplate.exchange(
                    uri,
                    HttpMethod.DELETE,
                    entity,
                    Void.class
            );

            result = response.getStatusCode().is2xxSuccessful();

            if (!result) {
                logEvent(LogLevel.ERROR, "Failed to delete user from Supabase", requestUserId);
                return false;
            }

            User user = userRepository.findById(UUID.fromString(id)).orElse(null);
            if (user != null) {
                userRepository.delete(user);
                rabbitTemplate.convertAndSend(USERS_QUEUE_NAME, user.getId());
            }
        } catch (Exception e) {
            logEvent(LogLevel.ERROR, e.getMessage(), requestUserId);
            return false;
        }
        return true;
    }

    private void logEvent(LogLevel level, String message, String userId) {
        rabbitTemplate.convertAndSend(LOGGING_QUEUE_NAME, new LoggingEvent(
                level,
                message,
                LocalDateTime.now(),
                APPLICATION_NAME,
                userId
        ));
    }
}
