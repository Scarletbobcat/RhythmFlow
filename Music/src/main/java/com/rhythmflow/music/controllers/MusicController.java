package com.rhythmflow.music.controllers;

import com.rhythmflow.music.entities.Song;
import com.rhythmflow.music.rabbitmq.HelloMessagePublisher;
import com.rhythmflow.music.services.SongService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/music")
public class MusicController {
    private final HelloMessagePublisher helloMessagePublisher;

    private final SongService songService;

    public MusicController(HelloMessagePublisher helloMessagePublisher, SongService songService) {
        this.helloMessagePublisher = helloMessagePublisher;
        this.songService = songService;
    }

    @PostMapping("/songs/send-hello-message")
    public ResponseEntity<String> sendHelloMessage() {
        String message = "Hello, RabbitMQ!";
        helloMessagePublisher.sendMessage(message);
        return ResponseEntity.ok("Message sent to RabbitMQ: " + message);
    }

    @GetMapping("/songs")
    public ResponseEntity<List<Song>> getSongs() {
        List<Song> songs = songService.findAll();
        if (songs != null && !songs.isEmpty()) {
            return ResponseEntity.ok(songs);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/songs/title")
    public ResponseEntity<Song> getSongByTitle(@RequestParam("title") String title) {
        System.out.println(title);
        Song song = songService.findByTitle(title);
        if (song != null) {
            return ResponseEntity.ok(song);
        }
        return ResponseEntity.notFound().build();
    }

}


