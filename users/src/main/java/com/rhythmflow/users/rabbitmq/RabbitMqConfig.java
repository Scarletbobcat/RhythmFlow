package com.rhythmflow.users.rabbitmq;

import com.rabbitmq.client.AMQP;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {
    public static String LOGGING_QUEUE_NAME = "logging.queue";

    public static String USERS_QUEUE_NAME = "users.queue";

    public static String MUSIC_QUEUE_NAME = "music.queue";

    public static String SEARCH_QUEUE_NAME = "search.queue";

    public static String PUB_SUB_UPDATE_USER = "pubsub.update.user";

    public static String MUSIC_DELETE_USER_QUEUE_NAME = "music.delete.user.queue";

    public static String SEARCH_DELETE_USER_QUEUE_NAME = "search.delete.user.queue";

    public static String PUB_SUB_DELETE_USER = "pubsub.delete.user";

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
    public Queue MusicQueue() {
        return new Queue(MUSIC_QUEUE_NAME, true);
    }

    @Bean
    public Queue SearchQueue() {
        return new Queue(SEARCH_QUEUE_NAME, true);
    }

    @Bean
    public TopicExchange updateUserExchange() {
        return new TopicExchange(PUB_SUB_UPDATE_USER);
    }

    @Bean
    public Binding MusicBinding(Queue MusicQueue, TopicExchange updateUserExchange) {
        return BindingBuilder.bind(MusicQueue).to(updateUserExchange).with("update-user");
    }

    @Bean
    public Binding SearchBinding(Queue SearchQueue, TopicExchange updateUserExchange) {
        return BindingBuilder.bind(SearchQueue).to(updateUserExchange).with("update-user");
    }

    @Bean
    public Queue MusicDeleteUserQueue() {
        return new Queue(MUSIC_DELETE_USER_QUEUE_NAME, true);
    }

    @Bean
    public Queue SearchDeleteUserQueue() {
        return new Queue(SEARCH_DELETE_USER_QUEUE_NAME, true);
    }

    @Bean
    public TopicExchange deleteUserExchange() {
        return new TopicExchange(PUB_SUB_DELETE_USER);
    }

    @Bean
    public Binding MusicDeleteUserBinding(Queue MusicDeleteUserQueue, TopicExchange deleteUserExchange) {
        return BindingBuilder.bind(MusicDeleteUserQueue).to(deleteUserExchange).with("delete-user");
    }

    @Bean
    public Binding SearchDeleteUserBinding(Queue SearchDeleteUserQueue, TopicExchange deleteUserExchange) {
        return BindingBuilder.bind(SearchDeleteUserQueue).to(deleteUserExchange).with("delete-user");
    }

    @Bean
    public Queue LoggingQueue() {
        return new Queue(LOGGING_QUEUE_NAME, true);
    }

    @Bean
    public Queue UsersQueue() {
        return new Queue(USERS_QUEUE_NAME, true);
    }
}