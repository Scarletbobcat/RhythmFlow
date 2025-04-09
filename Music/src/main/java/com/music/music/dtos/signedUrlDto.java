package com.music.music.dtos;

public class signedUrlDto {
    String url;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public signedUrlDto(String url) {
        this.url = url;
    }
}
