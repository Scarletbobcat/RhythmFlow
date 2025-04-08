package com.music.music.services;

import com.music.music.entities.Song;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.music.music.repositories.SongRepository;

@Service
public class SongService {

    @Autowired
    private SongRepository songRepository;

    public Song findByTitle(String title) {
        Song song = songRepository.findByTitle(title);
        return song;
    }
}
