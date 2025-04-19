package com.music.music.services;

import com.music.music.entities.Song;
import org.springframework.stereotype.Service;
import com.music.music.repositories.SongRepository;

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
