package com.example.mini_todo_list.authentication;

import com.example.mini_todo_list.user.UserDto;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Component
public class TokenProvider {

    private final long expiredTime = 1000 * 60 * 60 * 1L;

    Key key = Keys.hmacShaKeyFor(
            "thisissecretsomindyourownfuxxingbusiness".getBytes(StandardCharsets.UTF_8));

    private final UserDetailsService userDetailsService;

    public String generateToken(UserDto userDto) {
        return Jwts.builder().setSubject(userDto.getId())
                .setHeader(createHeader())
                .setClaims(createClaims(userDto))
                .setExpiration(new Date(System.currentTimeMillis() + expiredTime))
                .signWith(key, SignatureAlgorithm.HS256).compact();
    }

    public Map<String, Object> createHeader() {
        Map<String, Object> header = new HashMap<>();
        header.put("typ", "JWT");
        header.put("algorithm", "HS256");
        header.put("regDate", System.currentTimeMillis() / 1000);

        return header;
    }

    public Map<String, Object> createClaims(UserDto userDto) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userDto.getId());

        return claims;
    }

    public Claims getClaims(String token) {
        return (Claims) Jwts.parserBuilder().setSigningKey(key).build().parse(token).getBody();
    }

    public String getUsername(String token) {
        return (String) getClaims(token).get("userId");
    }

    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = getClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            System.out.println(e);
        }
        return false;
    }

    public Authentication getAuthentication(String token) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(getUsername(token));
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }
}
