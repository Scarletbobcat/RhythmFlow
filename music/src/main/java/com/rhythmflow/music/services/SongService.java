package com.rhythmflow.music.services;

import com.rhythmflow.music.dto.LoggingEvent;
import com.rhythmflow.music.dto.SongDto;
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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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

    public List<SongDto> findBySupabaseUserId(HttpServletRequest req) {
        String supabaseUserId = req.getHeader("X-User-Id");
        try {
            UserDto user = restTemplate.getForObject("http://users/users/supabaseId?supabaseId=" + supabaseUserId, UserDto.class);
            if (user == null) {
                logEvent(LogLevel.ERROR, "User not found", supabaseUserId);
                return null;
            }
            String userId = user.getId();
            List<Song> songs = songRepository.findByArtist(user.getId());
            if (songs == null || songs.isEmpty()) {
                logEvent(LogLevel.ERROR, "No songs found for user", userId);
                return null;
            }
            logEvent(LogLevel.INFO, "Songs found for user", userId);
            List<SongDto> songDtos = new ArrayList<>();
            for (Song song: songs) {
                songDtos.add(new SongDto(song.getId(), song.getTitle(), user.getArtistName(), song.getSongUrl(), song.getImageUrl(), song.getGenres()));
            }
            return songDtos;
        } catch (Exception e) {
            logEvent(LogLevel.ERROR, e.getMessage(), supabaseUserId);
            return null;
        }
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
