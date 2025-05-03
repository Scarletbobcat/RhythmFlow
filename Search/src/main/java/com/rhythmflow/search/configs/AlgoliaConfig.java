package com.rhythmflow.search.configs;

import com.algolia.api.SearchClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AlgoliaConfig {
    @Value("${algolia.applicationId}")
    private String applicationId;

    @Value("${algolia.apiKey}")
    private String apiKey;

    @Bean
    public SearchClient searchClient() {
        return new SearchClient(applicationId, apiKey);
    }
}
