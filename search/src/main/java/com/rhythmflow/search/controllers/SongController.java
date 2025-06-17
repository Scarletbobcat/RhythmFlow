package com.rhythmflow.search.controllers;

import com.algolia.model.search.SearchResponses;
import com.rhythmflow.search.entities.Song;
import com.rhythmflow.search.services.SongService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/search")
public class SongController {
    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping("/")
    public List<Song> index() {
        return songService.searchAll();
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok().build();
    }


    @GetMapping("/query")
    public SearchResponses<Song> query(@RequestParam String query) {
        return songService.searchWithQuery(query);
    }

    @PostMapping("/upload")
    public void upload(@RequestBody Song song) {
        songService.save(song);
        return;
    }

}
