package com.example.Gateway.configs;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

public class JwtUtil {

    @Value("${jwt.secret}")
    private static String SUPABASE_JWT_SECRET;

    private static Key getSigningKey() {
        byte[] keyBytes = SUPABASE_JWT_SECRET.getBytes(StandardCharsets.UTF_8);
        SecretKeySpec decodedKey = new SecretKeySpec(keyBytes, "HmacSHA256");
        return decodedKey;
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
