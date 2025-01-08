package com.example.apigateway.filter;

import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpRequestDecorator;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import java.security.Key;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.security.Key;

@Component
public class JwtAuthenticationFilter implements WebFilter {

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String userId = extractUserIdFromToken(token);

            if (userId != null) {
                // 새로운 헤더 맵 생성
                HttpHeaders headers = new HttpHeaders();
                headers.putAll(exchange.getRequest().getHeaders());
                headers.add("X-USER-ID", userId);

                // 새로운 ServerHttpRequest 생성
                ServerHttpRequest mutatedRequest = new ServerHttpRequestDecorator(exchange.getRequest()) {
                    @Override
                    public HttpHeaders getHeaders() {
                        return headers;
                    }
                };

                // 새로운 ServerWebExchange 생성
                ServerWebExchange mutatedExchange = exchange.mutate()
                        .request(mutatedRequest)
                        .build();

                return chain.filter(mutatedExchange);
            }
        }

        return chain.filter(exchange);
    }

    private String extractUserIdFromToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            String keyId = signedJWT.getHeader().getKeyID();

            RestTemplate restTemplate = new RestTemplate();
            String jwkSetResponse = restTemplate.getForObject(jwkSetUri, String.class);
            JWKSet jwkSet = JWKSet.parse(jwkSetResponse);

            // 토큰의 kid와 일치하는 키를 찾음
            RSAKey rsaKey = (RSAKey) jwkSet.getKeyByKeyId(keyId);
            if (rsaKey == null) {
                System.out.println("No matching key found for kid: " + keyId);
                return null;
            }

            JWSVerifier verifier = new RSASSAVerifier(rsaKey.toRSAPublicKey());
            if (signedJWT.verify(verifier)) {
                JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
                return claims.getSubject();
            }
            return null;
        } catch (Exception e) {
            System.out.println("Token verification error: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private Key getSigningKey() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String jwkSetResponse = restTemplate.getForObject(jwkSetUri, String.class);

            JWKSet jwkSet = JWKSet.parse(jwkSetResponse);
            RSAKey rsaKey = (RSAKey) jwkSet.getKeys().get(0);

            return rsaKey.toRSAPublicKey();
        } catch (Exception e) {
            throw new RuntimeException("Failed to load public key", e);
        }
    }
}