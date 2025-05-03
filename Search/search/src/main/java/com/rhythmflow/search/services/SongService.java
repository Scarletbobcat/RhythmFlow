package com.rhythmflow.search.services;

import com.algolia.api.SearchClient;
import com.algolia.model.search.*;
import com.rhythmflow.search.entities.Song;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

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

    public List<Song> searchAll() {
        return client.searchSingleIndex(indexName, Song.class).getHits();
    }
}
