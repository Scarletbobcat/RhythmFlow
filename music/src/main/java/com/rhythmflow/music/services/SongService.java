package com.rhythmflow.music.services;

import com.rhythmflow.music.dto.LoggingEvent;
import com.rhythmflow.music.dto.UserDto;
import com.rhythmflow.music.entities.Song;
import com.rhythmflow.music.enums.LogLevel;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.rhythmflow.music.repositories.SongRepository;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SongService {
    @Value("${rabbitmq.logging.queue}")
    private String LOGGING_QUEUE_NAME;

    @Value("${spring.application.name}")
    private String APPLICATION_NAME;

    private final RabbitTemplate rabbitTemplate;

    private final SongRepository songRepository;

    private final RestTemplate restTemplate;

    public SongService(SongRepository songRepository, RabbitTemplate rabbitTemplate, RestTemplate restTemplate) {
        this.songRepository = songRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.restTemplate = restTemplate;
    }

    public Song findByTitle(HttpServletRequest req, String title) {
        String userId = req.getHeader("X-User-Id");
        try {
            UserDto user = restTemplate.getForObject("http://users/users/supabase-id?supabaseId=" + userId, UserDto.class);
            if (user == null) {
                logEvent(LogLevel.ERROR, "User not found", userId);
                return null;
            }
        } catch (Exception e) {
            logEvent(LogLevel.ERROR, e.getMessage(), userId);
            return null;
        }
        Song song = songRepository.findByTitle(title);
        if (song != null) {
            logEvent(LogLevel.INFO, "Song found", userId);
            return song;
        } else {
            logEvent(LogLevel.ERROR, "Song not found", userId);
            return null;
        }
    }

    public List<Song> findAll() {
        return songRepository.findAll();
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
