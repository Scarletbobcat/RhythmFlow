package com.music.music.controllers;

import com.music.music.entities.Song;
import com.music.music.rabbitmq.HelloMessagePublisher;
import com.music.music.services.SongService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/music")
public class MusicController {

    Logger logger = LoggerFactory.getLogger(MusicController.class);

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
    public ResponseEntity<Song> getSongByTitle(@RequestParam("title") String title) {
        Song song = songService.findByTitle(title);
        if (song != null) {
            return ResponseEntity.ok(song);
        }
        return ResponseEntity.notFound().build();
    }

}


