package com.rhythmflow.music.services;

import com.rhythmflow.music.entities.Song;
import org.springframework.stereotype.Service;
import com.rhythmflow.music.repositories.SongRepository;

@Service
public class SongService {

    private final SongRepository songRepository;

    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    public Song findByTitle(String title) {
        return songRepository.findByTitle(title);
    }
}
