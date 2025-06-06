package com.rhythmflow.users.dtos;

import com.rhythmflow.users.enums.LogLevel;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LoggingEvent {
    private LogLevel level;
    private String message;
    private LocalDateTime timestamp;
    private String logger;
    private String userId;

    public LoggingEvent(LogLevel level, String message, LocalDateTime timestamp, String logger, String userId) {
        this.level = level;
        this.message = message;
        this.timestamp = timestamp;
        this.logger = logger;
        this.userId = userId;
    }
}
