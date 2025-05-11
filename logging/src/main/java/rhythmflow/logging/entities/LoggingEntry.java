package rhythmflow.logging.entities;

import rhythmflow.logging.enums.LogLevel;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Document(collection = "log_entries")
public class LoggingEntry {
    @Id
    private String id;
    private String userId;
    private LogLevel level;
    private String message;
    private LocalDateTime timestamp;
    private String logger;

    public LoggingEntry(LogLevel level, String logger, String message, String userId, LocalDateTime timestamp) {
        this.level = level;
        this.logger = logger;
        this.message = message;
        this.userId = userId;
        this.timestamp = timestamp;
    }
}
