package com.rhythmflow.music.controllers;

import com.rhythmflow.music.dto.LoggingEvent;
import com.rhythmflow.music.dto.SongDto;
import com.rhythmflow.music.dto.UserDto;
import com.rhythmflow.music.entities.Song;
import com.rhythmflow.music.enums.LogLevel;
import jakarta.servlet.http.HttpServletRequest;
import com.rhythmflow.music.services.SongService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/music")
public class MusicController {
    private final SongService songService;

    @Value("${r2.public-url}")
    private String R2_PUBLIC_URL;

    public MusicController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping("/songs")
    public ResponseEntity<List<SongDto>> getSongs() {
        List<Song> songs = songService.findAll();
        if (songs != null && !songs.isEmpty()) {
            List<SongDto> songDtos = new ArrayList<>();
            for (Song song : songs) {
                songDtos.add(new SongDto(song.getId().toString(), song.getTitle(), song.getArtistName(), R2_PUBLIC_URL + song.getSongPath(), R2_PUBLIC_URL + (song.getImagePath() == null ? "default-album.png" : song.getImagePath()), song.getGenres()));
            }
            return ResponseEntity.ok(songDtos);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/songs/title")
    public ResponseEntity<Song> getSongByTitle(HttpServletRequest req, @RequestParam("title") String title) {
        Song song = songService.findByTitle(req, title);
        if (song != null) {
            return ResponseEntity.ok(song);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/songs/user")
    public ResponseEntity<List<SongDto>> getSongsByUser(HttpServletRequest req) {
        List<SongDto> songs = songService.findByUserId(req);
        if (songs != null && !songs.isEmpty()) {
            return ResponseEntity.ok(songs);
        }
        return ResponseEntity.noContent().build();
    }

}


