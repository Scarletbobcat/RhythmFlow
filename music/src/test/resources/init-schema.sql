CREATE SCHEMA IF NOT EXISTS song_metadata;

CREATE TABLE IF NOT EXISTS song_metadata.songs (
   id UUID NOT NULL,
   title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    song_url VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    genres VARCHAR(255)[] NOT NULL,
    PRIMARY KEY (id)
);