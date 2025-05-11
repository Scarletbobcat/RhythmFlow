package rhythmflow.logging.dtos;

import rhythmflow.logging.enums.LogLevel;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.UUID;

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
