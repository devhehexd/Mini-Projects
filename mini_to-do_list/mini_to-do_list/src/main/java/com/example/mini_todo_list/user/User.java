package com.example.mini_todo_list.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
public class User {

    @Id
    private String id;

    private String password;
    private String email;
}
