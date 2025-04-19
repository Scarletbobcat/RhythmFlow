package com.rhythmflow.users.rabbitmq;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class HelloMessageListener {
    Logger logger = LoggerFactory.getLogger(HelloMessageListener.class);

    @RabbitListener(queues="hello_queue")
    public void receiveMessage(String message) {
        logger.info("Received message: {}", message);
    }
}
