package com.rhythmflow.music.services;

import com.rhythmflow.music.dto.LoggingEvent;
import com.rhythmflow.music.dto.SongDto;
import com.rhythmflow.music.dto.UserDto;
import com.rhythmflow.music.entities.Song;
import com.rhythmflow.music.enums.LogLevel;
import com.rhythmflow.music.rabbitmq.RabbitMqConfig;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.rhythmflow.music.repositories.SongRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SongService {
    @Value("${spring.application.name}")
    private String APPLICATION_NAME;

    @Value("${r2.public-url}")
    private String R2_PUBLIC_URL;

    private final RabbitTemplate rabbitTemplate;

    private final SongRepository songRepository;

    private final R2StorageService r2StorageService;

    public SongService(SongRepository songRepository, RabbitTemplate rabbitTemplate, R2StorageService r2StorageService) {
        this.songRepository = songRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.r2StorageService = r2StorageService;
    }

    public Song findByTitle(HttpServletRequest req, String title) {
        String userId = req.getHeader("X-User-Id");
        Song song = songRepository.findByTitle(title);
        if (song != null) {
            return song;
        } else {
            logEvent(LogLevel.ERROR, "Song not found", userId);
            return null;
        }
    }

    public List<Song> findAll() {
        return songRepository.findAll();
    }

    public List<SongDto> findByUserId(HttpServletRequest req) {
        String userId = req.getHeader("X-User-Id");
        try {
            List<Song> songs = songRepository.findByArtistId(userId);
            if (songs == null || songs.isEmpty()) {
                logEvent(LogLevel.ERROR, "No songs found for user", userId);
                return null;
            }
            List<SongDto> songDtos = new ArrayList<>();
            for (Song song : songs) {
                songDtos.add(new SongDto(song.getId().toString(), song.getTitle(), song.getArtistName(), R2_PUBLIC_URL + song.getSongPath(), R2_PUBLIC_URL + (song.getImagePath() == null ? "default-album.png" : song.getImagePath()), song.getGenres()));
            }
            return songDtos;
        } catch (Exception e) {
            logEvent(LogLevel.ERROR, e.getMessage(), userId);
            return null;
        }
    }

    @RabbitListener(queues = RabbitMqConfig.MUSIC_DELETE_USER_QUEUE_NAME)
    public void deleteSongsByArtistId(UserDto user) {
        String userId = user.getId();
        try {
            List<Song> songs = songRepository.findByArtistId(userId);
            for (Song song : songs) {
                if (song.getSongPath() != null) {
                    r2StorageService.deleteSongFiles(song.getSongPath());
                }
                if (song.getImagePath() != null) {
                    r2StorageService.deleteImageFile(song.getImagePath());
                }
            }
            songRepository.deleteAll(songs);
        } catch (Exception e) {
            logEvent(LogLevel.ERROR, "Error deleting songs for artist: " + e.getMessage(), userId);
        }
    }

    @RabbitListener(queues = RabbitMqConfig.MUSIC_QUEUE_NAME)
    public void updateArtist(UserDto user) {
        List<Song> songs = songRepository.findByArtistId(user.getId());
        List<Song> updatedSongs = new ArrayList<>();
        for (Song song : songs) {
            song.setArtistName(user.getArtistName());
            updatedSongs.add(song);
        }
        songRepository.saveAll(updatedSongs);
    }

    private void logEvent(LogLevel level, String message, String userId) {
        rabbitTemplate.convertAndSend(RabbitMqConfig.LOGGING_QUEUE_NAME, new LoggingEvent(
                level,
                message,
                LocalDateTime.now(),
                APPLICATION_NAME,
                userId
        ));
    }

}
