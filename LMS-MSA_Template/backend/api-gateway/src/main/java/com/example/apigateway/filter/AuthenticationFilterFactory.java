package com.example.apigateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

public class AuthenticationFilterFactory extends AbstractGatewayFilterFactory<AuthenticationFilterFactory.Config> {

    public AuthenticationFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            return ReactiveSecurityContextHolder.getContext()
                    .flatMap(ctx -> {
                        Authentication auth = ctx.getAuthentication();
                        if (auth != null && auth.isAuthenticated()) {
                            ServerHttpRequest request = exchange.getRequest().mutate()
                                    .header("X-Auth-User-Id", auth.getName())
                                    .build();
                            return chain.filter(exchange.mutate().request(request).build());
                        }
                        return chain.filter(exchange);
                    })
                    .switchIfEmpty(chain.filter(exchange));
        };
    }

    public static class Config {
        // 설정이 필요한 경우 여기에 추가
    }
}