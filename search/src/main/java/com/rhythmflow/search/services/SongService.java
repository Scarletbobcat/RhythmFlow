package com.rhythmflow.search.services;

import com.algolia.api.SearchClient;
import com.algolia.model.search.*;
import com.rhythmflow.search.dtos.UserDto;
import com.rhythmflow.search.entities.Song;
import com.rhythmflow.search.rabbitmq.RabbitMqConfig;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.management.Query;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SongService {
    private final SearchClient client;

    @Value("${algolia.indexName}")
    private String indexName;

    public SongService(SearchClient client) {
        this.client = client;
    }

    public void save(Song song) {
        try {
            client.saveObject(indexName, song);
        } catch (Exception e) {
            throw new RuntimeException("Error saving song to Algolia: " + e.getMessage());
        }
    }

    public SearchResponses<Song> searchWithQuery(String query) {
        return client.search(new SearchMethodParams().setRequests(
                List.of(new SearchForHits().setIndexName(indexName).setQuery(query))
        ), Song.class);
    }

    @RabbitListener(queues = RabbitMqConfig.SEARCH_QUEUE_NAME)
    public void updateArtist(UserDto user) {
        List<Map> songs = getSongsByArtistId(user.getId());

        List<Map> recordsToUpdate = new ArrayList<>();

        for (Map hit : songs) {
            Map<String, Object> updateRecords = new HashMap<>();
            updateRecords.put("objectID", hit.get("objectID"));
            updateRecords.put("artistName", user.getArtistName());
            recordsToUpdate.add(updateRecords);
        }

        client.partialUpdateObjects(indexName, recordsToUpdate, false);
    }

    @RabbitListener(queues = RabbitMqConfig.SEARCH_DELETE_USER_QUEUE_NAME)
    public void deleteArtist(UserDto user) {
        List<Map> songs = getSongsByArtistId(user.getId());

        List<String> objectIds = songs.stream()
                .map(song -> (String) song.get("objectID"))
                .collect(Collectors.toList());

        client.deleteObjects(indexName, objectIds);
    }

    public List<Song> searchAll() {
        return client.searchSingleIndex(indexName, Song.class).getHits();
    }

    private List<Map> getSongsByArtistId(String artistId) {
        SearchParamsObject searchParams = new SearchParamsObject();
        searchParams
                .setQuery("");
        searchParams.setFilters("artistId:" + artistId);
        searchParams.setHitsPerPage(1000);

        SearchResponse<Map> searchResult = client.searchSingleIndex(indexName, searchParams, Map.class);

        return searchResult.getHits();
    }
}
