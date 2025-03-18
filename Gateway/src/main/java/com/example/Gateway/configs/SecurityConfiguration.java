package com.example.Gateway.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfiguration {

    private final CorsConfigurer corsConfiguration;
    private final JwtConfiguration jwtConfiguration;

    public SecurityConfiguration(CorsConfigurer corsConfiguration, JwtConfiguration jwtConfiguration) {
        this.corsConfiguration = corsConfiguration;
        this.jwtConfiguration = jwtConfiguration;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> cors.configurationSource(corsConfiguration.corsConfigurationSource()))
                .authorizeExchange(exchanges ->
                        exchanges
//                                .pathMatchers("/").permitAll()
                                .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth -> oauth
                .jwt(jwt -> jwt.jwtDecoder(jwtConfiguration.jwtDecoder())));
        return http.build();
    }





}