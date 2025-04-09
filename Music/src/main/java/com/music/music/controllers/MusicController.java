package com.music.music.controllers;

import com.music.music.entities.Song;
//import com.music.music.services.R2Service;
import com.music.music.rabbitmq.HelloMessagePublisher;
import com.music.music.services.SongService;
import com.netflix.discovery.converters.Auto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.music.music.dtos.signedUrlDto;

@RestController
@RequestMapping("/music")
public class MusicController {
//    @Autowired
//    private R2Service r2Service;
    Logger logger = LoggerFactory.getLogger(MusicController.class);

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private HelloMessagePublisher helloMessagePublisher;

    @Autowired
    private SongService songService;

//    @GetMapping("/{fileName}")
//    public ResponseEntity<signedUrlDto> getSignedUrl(@PathVariable String fileName) {
//        String url = r2Service.generateSignedUrl(fileName);
//        return ResponseEntity.ok(new signedUrlDto(url));
//    }

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


