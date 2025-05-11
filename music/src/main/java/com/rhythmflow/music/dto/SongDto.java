package com.rhythmflow.music.dto;

import lombok.Data;

import java.util.List;

@Data
public class SongDto {
    private String id;
    private String title;
    private String artist;
    private String songUrl;
    private String imageUrl;
    private List<String> genres;

    public SongDto(String id, String title, String artist, String songUrl, String imageUrl, List<String> genres) {
        this.id = id;
        this.title = title;
        this.artist = artist;
        this.songUrl = songUrl;
        this.imageUrl = imageUrl;
        this.genres = genres;
    }
}
