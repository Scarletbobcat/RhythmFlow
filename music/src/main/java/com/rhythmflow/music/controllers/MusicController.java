package com.rhythmflow.music.controllers;

import com.rhythmflow.music.dto.SongDto;
import com.rhythmflow.music.dto.UserDto;
import com.rhythmflow.music.entities.Song;
import com.rhythmflow.music.rabbitmq.HelloMessagePublisher;
import com.rhythmflow.music.services.SongService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/music")
public class MusicController {
    private final HelloMessagePublisher helloMessagePublisher;

    private final SongService songService;

    private final RestTemplate restTemplate;

    public MusicController(HelloMessagePublisher helloMessagePublisher, SongService songService, RestTemplate restTemplate) {
        this.helloMessagePublisher = helloMessagePublisher;
        this.songService = songService;
        this.restTemplate = restTemplate;
    }

    @PostMapping("/songs/send-hello-message")
    public ResponseEntity<String> sendHelloMessage() {
        String message = "Hello, RabbitMQ!";
        helloMessagePublisher.sendMessage(message);
        return ResponseEntity.ok("Message sent to RabbitMQ: " + message);
    }

    @GetMapping("/songs")
    public ResponseEntity<List<SongDto>> getSongs() {
        List<Song> songs = songService.findAll();
        if (songs != null && !songs.isEmpty()) {
            List<SongDto> songDtos = new ArrayList<>();
            for (Song song : songs) {
                UserDto user = restTemplate.getForObject("http://users/users/id?id=" + song.getArtist(), UserDto.class);
                String artist = "Unknown";
                if (user != null) {
                    artist = user.getArtistName();
                }
                songDtos.add(new SongDto(song.getId(), song.getTitle(), artist, song.getSongUrl(), song.getImageUrl(), song.getGenres()));
            }
            return ResponseEntity.ok(songDtos);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/songs/title")
    public ResponseEntity<Song> getSongByTitle(@RequestParam("title") String title) {
        Song song = songService.findByTitle(title);
        if (song != null) {
            return ResponseEntity.ok(song);
        }
        return ResponseEntity.notFound().build();
    }

}


