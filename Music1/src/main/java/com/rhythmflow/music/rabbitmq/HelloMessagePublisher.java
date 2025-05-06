package com.rhythmflow.music.rabbitmq;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class HelloMessagePublisher {
    private final RabbitTemplate rabbitTemplate;
    public HelloMessagePublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendMessage(String message) {
        rabbitTemplate.convertAndSend("hello_queue", message);
    }
}
