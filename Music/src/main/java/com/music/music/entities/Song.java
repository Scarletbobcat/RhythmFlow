package com.music.music.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(schema="song_metadata", name="songs")
public class Song {
    @Id
    @GeneratedValue(generator = "UUID")
    private String id;

    private String title;

    private String artist;

    private String songUrl;
}
