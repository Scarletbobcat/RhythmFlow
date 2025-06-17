package com.rhythmflow.music;

import com.rhythmflow.music.dto.UserDto;
import com.rhythmflow.music.entities.Song;
import com.rhythmflow.music.repositories.SongRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestTemplate;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Testcontainers
public class MusicControllerIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>("postgres:16")
            .withInitScript("init-schema.sql");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SongRepository songRepository;

    @MockitoBean
    private RestTemplate restTemplate;

    private void cleanup(SongRepository songRepository) {
        songRepository.deleteAll();
    }

    @Test
    void shouldAddSingleSong() throws Exception {
        Song song = new Song();
        song.setTitle("Test Song");
        song.setArtistId(UUID.randomUUID().toString());
        song.setArtistName("Test Artist");
        song.setSongPath("song.mp3");
        song.setImagePath("image.jpg");
        song.setGenres(List.of("Pop"));
        songRepository.save(song);

        UserDto mockUser = new UserDto(UUID.randomUUID().toString(), "test", "test@gmail.com", "...");
        when(restTemplate.getForObject(anyString(), eq(UserDto.class))).thenReturn(mockUser);

        mockMvc.perform(get("/music/songs/title")
                        .param("title", "Test Song"))
                .andExpect(status().isOk())
                .andExpect(result -> {
                    String content = result.getResponse().getContentAsString();
                    assert content.contains("Test Song");
                });
    }

    @Test
    void shouldReturnSongByTitle() throws Exception {
        Song song = new Song();
        song.setTitle("Test Song");
        song.setArtistId(UUID.randomUUID().toString());
        song.setArtistName("Test Artist");
        song.setSongPath("song.mp3");
        song.setImagePath("image.jpg");
        song.setGenres(List.of("Pop"));
        songRepository.save(song);

        UserDto mockUser = new UserDto(UUID.randomUUID().toString(), "test", "test@gmail.com", "...");
        when(restTemplate.getForObject(anyString(), eq(UserDto.class))).thenReturn(mockUser);
        mockMvc.perform(get("/music/songs"))
                .andExpect(status().isOk());
        cleanup(songRepository);
    }
}
