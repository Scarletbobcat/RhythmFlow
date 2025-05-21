package com.rhythmflow.gateway.filters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtSubjectExtractorFilter implements GlobalFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtSubjectExtractorFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return exchange.getPrincipal()
                .doOnNext(principal -> logger.info("Principal type: {}", principal.getClass().getName()))
                .filter(principal -> principal instanceof Authentication)
                .cast(Authentication.class)
                .filter(Authentication::isAuthenticated)
                .filter(authentication -> authentication instanceof JwtAuthenticationToken)
                .cast(JwtAuthenticationToken.class)
                .map(jwtAuth -> {
                    String subject = jwtAuth.getToken().getSubject();
                    logger.info("Adding X-User-Id header with value: {}", subject);

                    // Add the subject as a custom header
                    ServerHttpRequest request = exchange.getRequest().mutate()
                    .headers(httpHeaders -> {
                        httpHeaders.remove("X-User-Id");
                        httpHeaders.add("X-User-Id", subject);
                    })
                            .build();

                    return exchange.mutate().request(request).build();
                })
                .defaultIfEmpty(exchange)
                .doOnNext(modifiedExchange -> {
                    if (modifiedExchange == exchange) {
                        logger.warn("No JWT authentication found, header not added");
                    }
                })
                .flatMap(chain::filter);
    }


//    @Override
//    public int getOrder() {
//        // Execute after SecurityWebFilterChain but before routing
//        return 1;
//    }
}