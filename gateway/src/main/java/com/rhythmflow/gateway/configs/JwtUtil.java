package com.rhythmflow.gateway.configs;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

public class JwtUtil {

    // private constructor to prevent instantiation
    private JwtUtil() {
    }

    @Value("${jwt.secret}")
    private static String supabaseJwtSecret;

    private static Key getSigningKey() {
        byte[] keyBytes = supabaseJwtSecret.getBytes(StandardCharsets.UTF_8);
        return new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    public static boolean validateToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);

            Date expiration = claims.getBody().getExpiration();
            return expiration == null || expiration.after(new Date()); // Token is valid if not expired
        } catch (JwtException e) {
            return false; // Invalid token
        }
    }
}
