package com.rhythmflow.gateway.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
public class JwtConfiguration {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        SecretKeySpec hmacKey = new SecretKeySpec(keyBytes, "HmacSHA256");

        NimbusReactiveJwtDecoder decoder = NimbusReactiveJwtDecoder.withSecretKey(hmacKey)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();

        // Add custom validator to reject 'none' algorithm
        decoder.setJwtValidator(jwt -> {
            // Check if algorithm is null or 'none'
            String algorithm = jwt.getHeaders().get("alg") != null ?
                    jwt.getHeaders().get("alg").toString() : "";

            if (algorithm.equalsIgnoreCase("none")) {
                return OAuth2TokenValidatorResult.failure(
                        new OAuth2Error("invalid_token", "Algorithm 'none' is not allowed", null));
            }

            if (!algorithm.equals("HS256")) {
                return OAuth2TokenValidatorResult.failure(
                        new OAuth2Error("invalid_token", "Only HS256 algorithm is allowed", null));
            }

            return OAuth2TokenValidatorResult.success();
        });

        return decoder;
    }

}
