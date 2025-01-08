//package com.example.payment_test_backend.domain;
//
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.web.servlet.HandlerInterceptor;
//
//import java.util.Set;
//
//public class PortoneIpInterceptor implements HandlerInterceptor {
//
//    private static final Set<String> ALLOWED_IPS = Set.of(
//            "52.78.100.19",
//            "52.78.48.223",
//            "52.78.5.241"
//    );
//
//    @Override
//    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
//        String clientIp = request.getRemoteAddr();
//        if (!ALLOWED_IPS.contains(clientIp)) {
//            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//            return false;
//        }
//        return true;
//    }
//}
