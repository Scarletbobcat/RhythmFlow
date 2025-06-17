package com.rhythmflow.music.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.Delete;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectsRequest;
import software.amazon.awssdk.services.s3.model.ObjectIdentifier;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import jakarta.annotation.PostConstruct;

@Service
public class R2StorageService {
    private static final Logger logger = LoggerFactory.getLogger(R2StorageService.class);

    @Value("${r2.public-url}")
    private String R2_PUBLIC_URL;

    @Value("${r2.endpoint}")
    private String R2_ENDPOINT;

    @Value("${r2.access-key}")
    private String R2_ACCESS_KEY;

    @Value("${r2.secret-key}")
    private String R2_SECRET_KEY;

    @Value("${r2.bucket-name}")
    private String R2_BUCKET_NAME;

    private S3Client getR2Client() {
        return S3Client.builder()
                .region(Region.of("auto"))
                .endpointOverride(URI.create(R2_ENDPOINT))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(R2_ACCESS_KEY, R2_SECRET_KEY)
                )).build();
    }

    public void deleteImageFile(String imagePath) {
        S3Client r2Client = getR2Client();

        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(R2_BUCKET_NAME)
                .key(imagePath)
                .build();
        r2Client.deleteObject(deleteObjectRequest);
    }

    public void deleteSongFiles(String songPath) {
        try {
            // Extract song ID from the path (format: <UUID>/...)
            String songId = extractSongId(songPath);
            if (songId == null) {
                logger.error("Failed to extract song ID from path: {}", songPath);
                return;
            }

            // Step 1: Fetch and parse master playlist
            String masterPlaylistUrl = R2_PUBLIC_URL + songId + "/master_playlist.m3u8";
            Set<String> allFiles = new HashSet<>();

            // Add master playlist to files to delete
            allFiles.add(songId + "/master_playlist.m3u8");

            // Get bitrate playlist URLs from master playlist
            List<String> bitratePlaylistUrls = fetchBitratePlaylistUrls(masterPlaylistUrl);

            // Step 2: For each bitrate playlist, get all segment files
            for (String bitrateUrl : bitratePlaylistUrls) {
                // Extract relative path for playlist file
                String relativePath = bitrateUrl.replace(R2_PUBLIC_URL, "");
                allFiles.add(relativePath);

                // Get all segment files from this playlist
                List<String> segmentFiles = fetchSegmentFiles(bitrateUrl);
                for (String segmentUrl : segmentFiles) {
                    String segmentPath = segmentUrl.replace(R2_PUBLIC_URL, "");
                    allFiles.add(segmentPath);
                }
            }

            // Step 3: Delete all files in batches
            batchDeleteFiles(allFiles);

            logger.info("Successfully deleted {} files for song ID: {}", allFiles.size(), songId);
        } catch (Exception e) {
            logger.error("Error deleting song files for path {}: {}", songPath, e.getMessage(), e);
        }
    }

    private String extractSongId(String songPath) {
        Pattern pattern = Pattern.compile("([a-f0-9-]{36})");
        Matcher matcher = pattern.matcher(songPath);
        return matcher.find() ? matcher.group(1) : null;
    }

    private List<String> fetchBitratePlaylistUrls(String masterPlaylistUrl) throws IOException {
        List<String> urls = new ArrayList<>();
        String content = fetchUrlContent(masterPlaylistUrl);

        try (BufferedReader reader = new BufferedReader(new java.io.StringReader(content))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.startsWith("https://")) {
                    urls.add(line.trim());
                }
            }
        }

        return urls;
    }

    private List<String> fetchSegmentFiles(String playlistUrl) throws IOException {
        List<String> segments = new ArrayList<>();
        String content = fetchUrlContent(playlistUrl);

        try (BufferedReader reader = new BufferedReader(new java.io.StringReader(content))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.startsWith("https://") && line.endsWith(".ts")) {
                    segments.add(line.trim());
                }
            }
        }

        return segments;
    }

    private String fetchUrlContent(String urlString) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");

        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(connection.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
        }

        return content.toString();
    }

    private void batchDeleteFiles(Set<String> files) {
        S3Client r2Client = getR2Client();

        // S3 allows up to 1000 files per batch delete
        List<List<String>> batches = new ArrayList<>();
        List<String> currentBatch = new ArrayList<>();

        for (String file : files) {
            currentBatch.add(file);
            if (currentBatch.size() == 1000) {
                batches.add(currentBatch);
                currentBatch = new ArrayList<>();
            }
        }

        if (!currentBatch.isEmpty()) {
            batches.add(currentBatch);
        }

        // Delete each batch
        for (List<String> batch : batches) {
            try {
                List<ObjectIdentifier> objectIds = batch.stream()
                        .map(key -> ObjectIdentifier.builder().key(key).build())
                        .toList();

                r2Client.deleteObjects(DeleteObjectsRequest.builder()
                        .bucket(R2_BUCKET_NAME)
                        .delete(Delete.builder()
                                .objects(objectIds)
                                .build())
                        .build());
            } catch (Exception e) {
                logger.error("Error deleting batch of files: {}", e.getMessage(), e);
            }
        }
    }
}