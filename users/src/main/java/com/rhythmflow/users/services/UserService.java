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
import java.util.UUID;

@Service
public class UserService {

    private final HttpServletResponse httpServletResponse;
    @Value("${rabbitmq.logging.queue}")
    private String LOGGING_QUEUE_NAME;

    @Value("${spring.application.name}")
    private String APPLICATION_NAME;

    @Value("${supabase.serviceRoleKey}")
    private String SUPABASE_SERVICE_ROLE_KEY;

    @Value("${supabase.url}")
    private String SUPABASE_URL;

    private final UserRepository userRepository;

    private final RabbitTemplate rabbitTemplate;

    private final RestTemplate restTemplate;

    public UserService(UserRepository userRepository, RabbitTemplate rabbitTemplate, RestTemplate restTemplate, HttpServletResponse httpServletResponse) {
        this.userRepository = userRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.restTemplate = restTemplate;
        this.httpServletResponse = httpServletResponse;
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User findUserById(String id) {
        return userRepository.findById(UUID.fromString(id)).orElse(null);
    }

    public User findUserBySupabaseId(String supabaseId) {
        return userRepository.findBySupabaseId(UUID.fromString(supabaseId));
    }

    public void createUser(User user) {
        userRepository.save(user);
    }

    public boolean deleteUser(String supabaseUserId) {
        boolean result = false;
        User user = userRepository.findBySupabaseId(UUID.fromString(supabaseUserId));
        if (user != null) {
            try {
                userRepository.delete(user);
                try {
                    RestTemplate directRestTemplate = new RestTemplate();

                    String url = SUPABASE_URL + "/auth/v1/admin/users/" + supabaseUserId;

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

                    System.out.println("Supabase API response status: " + response.getStatusCode());
                    result = response.getStatusCode().is2xxSuccessful();
                } catch (Exception e) {
                    logEvent(LogLevel.ERROR, e.getMessage(), user.getId().toString());
                }
            } catch (Exception e) {
                logEvent(LogLevel.ERROR, e.getMessage(), user.getId().toString());
            }
        }
        return result;
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
