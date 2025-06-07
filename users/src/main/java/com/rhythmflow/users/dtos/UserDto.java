package com.rhythmflow.users.dtos;

import lombok.Data;

@Data
public class UserDto {
    private String id;
    private String artistName;
    private String email;
    private String profilePictureUrl;

    public UserDto(String id, String artistName, String email, String profilePictureUrl) {
        this.id = id;
        this.artistName = artistName;
        this.email = email;
        this.profilePictureUrl = profilePictureUrl;
    }
}
