package com.rhythmflow.search.entities;


import lombok.Data;

import java.util.List;

@Data
public class Song {
    private String id;

    private String title;

    private String artist;

    private String songUrl;

    private String imageUrl;

    private List<String> genres;
}
