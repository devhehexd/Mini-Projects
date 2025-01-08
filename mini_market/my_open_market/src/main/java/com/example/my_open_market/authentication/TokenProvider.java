package com.example.my_open_market.authentication;

import com.example.my_open_market.user.UserDto;
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
            "jblkjgnaljefeablkgbakdvnrruhopqirihsgnbvmkrhbglsnaefa"
                    .getBytes(StandardCharsets.UTF_8));

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
        header.put("regDate", System.currentTimeMillis());
        return header;
    }

    public Map<String, Object> createClaims(UserDto userDto) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", userDto.getId());
        claims.put("type", userDto.getType());
        return claims;
    }

    public Claims getClaims(String token) {
        return (Claims) Jwts.parserBuilder().setSigningKey(key).build().parse(token).getBody();
    }

    public String getUsername(String token) {
        return (String) getClaims(token).get("username");
    }

    public String getType(String token) {
        return (String) getClaims(token).get("type");
    }

    public String resolveToken(HttpServletRequest request) {
        return request.getHeader("token");
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
