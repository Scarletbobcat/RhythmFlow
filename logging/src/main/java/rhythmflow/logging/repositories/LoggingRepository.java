package rhythmflow.logging.repositories;

import rhythmflow.logging.entities.LoggingEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoggingRepository extends MongoRepository<LoggingEntry, String> {
}
