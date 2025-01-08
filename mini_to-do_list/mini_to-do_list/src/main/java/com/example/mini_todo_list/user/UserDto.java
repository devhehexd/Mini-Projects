package com.example.mini_todo_list.user;

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
}
