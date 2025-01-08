package com.example.payment_test_backend.domain;

//import javax.crypto.Mac;
//import javax.crypto.spec.SecretKeySpec;
//import java.nio.charset.StandardCharsets;
//import java.security.InvalidKeyException;
//import java.security.NoSuchAlgorithmException;
//import java.util.Base64;
//
//public class PortOneWebHookVerifier {
//
//    private static final String HMAC_SHA256_ALGORITHM = "HmacSHA256";
//
//    public static boolean isValidSignature(String message, String signature, String secretKey) {
//
//        try {
//            SecretKeySpec signingKey = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), HMAC_SHA256_ALGORITHM);
//            Mac mac = Mac.getInstance(HMAC_SHA256_ALGORITHM);
//            mac.init(signingKey);
//
//            byte[] rawHmac = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
//            String calculatedSignature = Base64.getEncoder().encodeToString(rawHmac);
//
//            return signature.equals(calculatedSignature);
//
//        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
//            return false;
//        }
//    }
//}
