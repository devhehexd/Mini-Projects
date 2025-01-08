package com.example.cartservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class DuplicateCourseException extends RuntimeException {
    public DuplicateCourseException(Long courseId) {
        super("Course already exists in cart: " + courseId);
    }
}
