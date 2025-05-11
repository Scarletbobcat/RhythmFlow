package com.rhythmflow.music.dto;

import lombok.Data;

@Data
public class UserDto {
    private String id;
    private String artistName;
    private String email;
    private String supabaseUrl;
    private String profilePictureUrl;
    private String role;

    public UserDto(String id, String artistName, String email, String supabaseUrl, String profilePictureUrl, String role) {
        this.id = id;
        this.artistName = artistName;
        this.email = email;
        this.supabaseUrl = supabaseUrl;
        this.profilePictureUrl = profilePictureUrl;
        this.role = role;
    }
}
