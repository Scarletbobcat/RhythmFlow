package com.music.music.controllers;

import com.music.music.entities.Song;
//import com.music.music.services.R2Service;
import com.music.music.services.SongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.music.music.dtos.signedUrlDto;

@RestController
@RequestMapping("/music")
public class MusicController {
//    @Autowired
//    private R2Service r2Service;

    @Autowired
    private SongService songService;

//    @GetMapping("/{fileName}")
//    public ResponseEntity<signedUrlDto> getSignedUrl(@PathVariable String fileName) {
//        String url = r2Service.generateSignedUrl(fileName);
//        return ResponseEntity.ok(new signedUrlDto(url));
//    }

    @GetMapping("/songs")
    public ResponseEntity<Song> getSongByTitle(@RequestParam("title") String title) {
        Song song = songService.findByTitle(title);
        if (song != null) {
            return ResponseEntity.ok(song);
        }
        return ResponseEntity.notFound().build();
    }

}


