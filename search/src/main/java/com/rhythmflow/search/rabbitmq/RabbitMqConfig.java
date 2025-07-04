package com.rhythmflow.search.rabbitmq;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    public final static String LOGGING_QUEUE_NAME = "log.queue";

    public final static String USERS_QUEUE_NAME = "users.queue";

    public final static String SEARCH_QUEUE_NAME = "search.queue";

    public final static String SEARCH_DELETE_USER_QUEUE_NAME = "search.delete.user.queue";

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }

    @Bean
    public Queue SearchDeleteUserQueue() {
        return new Queue(SEARCH_DELETE_USER_QUEUE_NAME, true);
    }

    @Bean
    public Queue SearchQueue() {
        return new Queue(SEARCH_QUEUE_NAME, true);
    }

    @Bean
    public Queue UsersQueue() {
        return new Queue(USERS_QUEUE_NAME, true);
    }

    @Bean
    public Queue LoggingQueue() {
        return new Queue(LOGGING_QUEUE_NAME, true);
    }
}