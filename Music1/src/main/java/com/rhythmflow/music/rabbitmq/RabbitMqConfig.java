package com.rhythmflow.music.rabbitmq;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    public static final String QUEUE_NAME = "hello_queue";

    @Bean
    public Queue helloQueue() {
        return new Queue(QUEUE_NAME, true); // durable = true
    }
}