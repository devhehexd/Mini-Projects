package com.example.my_open_market.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserDto {

    private String id;
    private String password;
    private String email;
    private String type;
}
