package com.rhythmflow.users.services;

import com.rhythmflow.users.dtos.LoggingEvent;
import com.rhythmflow.users.dtos.UserDto;
import com.rhythmflow.users.entities.User;
import com.rhythmflow.users.enums.LogLevel;
import com.rhythmflow.users.rabbitmq.RabbitMqConfig;
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
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Service
public class UserService {

    @Value("${r2.endpoint}")
    private String R2_ENDPOINT;

    @Value("${r2.public-url}")
    private String R2_PUBLIC_URL;

    @Value("${r2.access-key}")
    private String r2_ACCESS_KEY;

    @Value("${r2.secret-key}")
    private String r2_SECRET_KEY;

    @Value("${r2.bucket-name}")
    private String R2_BUCKET_NAME;

    private S3Client getR2Client() {
        return S3Client.builder()
                .region(Region.of("auto"))
                .endpointOverride(URI.create(R2_ENDPOINT))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(r2_ACCESS_KEY, r2_SECRET_KEY)
                )).build();
    }

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

    public UserDto findUserById(String id) {
        User user = userRepository.findById(UUID.fromString(id)).orElse(null);
        if (user == null) {
            logEvent(LogLevel.ERROR, "User not found", id);
            return null;
        }
        if (user.getProfilePicturePath() == null) {
            return new UserDto(user.getId().toString(), user.getArtistName(), user.getEmail(), "https://pub-42d66efa46ef493a82e56e237e5e8a5b.r2.dev/user.png");
        }
        return new UserDto(user.getId().toString(), user.getArtistName(), user.getEmail(), R2_PUBLIC_URL + user.getProfilePicturePath());
    }

    public void createUser(User user) {
        userRepository.save(user);
    }

    public boolean updateUser(String requestUserId, String id, String artistName, MultipartFile image) {
        if (!Objects.equals(requestUserId, id)) {
            logEvent(LogLevel.ERROR, "User not allowed to update", requestUserId);
            return false;
        }
        try {
            User user = userRepository.findById(UUID.fromString(id)).orElse(null);
            if (user == null) {
                logEvent(LogLevel.ERROR, "User not found", requestUserId);
                return false;
            }

            // Process image if provided
            if (image != null && !image.isEmpty()) {

                // Generate unique filename
                String filename = id + "/" + image.getOriginalFilename();

                S3Client r2Client = getR2Client();

                DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                        .bucket(R2_BUCKET_NAME)
                        .key(user.getProfilePicturePath())
                        .build();

                r2Client.deleteObject(deleteObjectRequest);

                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(R2_BUCKET_NAME)
                        .key(filename)
                        .contentType(image.getContentType())
                        .build();

                r2Client.putObject(putObjectRequest, RequestBody.fromInputStream(image.getInputStream(), image.getSize()));

                //Update user's image path in database
                user.setProfilePicturePath(filename);
            }

            user.setArtistName(artistName);
            userRepository.save(user);
            rabbitTemplate.convertAndSend(RabbitMqConfig.PUB_SUB_UPDATE_USER, "update-user", user);
        } catch (Exception e) {
            logEvent(LogLevel.ERROR, e.getMessage(), requestUserId);
            return false;
        }
        return true;
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
                rabbitTemplate.convertAndSend(RabbitMqConfig.PUB_SUB_DELETE_USER, "delete-user", user);
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
