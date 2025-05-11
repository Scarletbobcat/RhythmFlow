package rhythmflow.logging.services;

import org.springframework.beans.factory.annotation.Value;
import rhythmflow.logging.dtos.LoggingEvent;
import rhythmflow.logging.entities.LoggingEntry;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import rhythmflow.logging.repositories.LoggingRepository;

@Service
public class LoggingService {

    private final LoggingRepository loggingRepository;

    public LoggingService(LoggingRepository loggingRepository) {
        this.loggingRepository = loggingRepository;
    }

    @RabbitListener(queues = "${logging.rabbitmq.queue}")
    public void receiveLogEvent(LoggingEvent event) {
        LoggingEntry entry = new LoggingEntry(event.getLevel(), event.getLogger(), event.getMessage(), event.getUserId(), event.getTimestamp());

        loggingRepository.save(entry);
    }
}
