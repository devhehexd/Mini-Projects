package com.example.mini_todo_list.todo_list;

import com.example.mini_todo_list.user.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
public class ToDoList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int number;

    private String toDo;
    private String details;

    @ManyToOne
    @JoinColumn(nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User writer;

    private Date postDate;

    @JsonProperty("dDay") //이 어노테이션을 사용하여 명시적으로 변수명 지정(직렬화 방지)
    // 자바의 변수명은 CamelCase(dDay) 스타일을 사용하는 반면,
    // JSON 형식으로 직렬화되면 일부 라이브러리나 설정에 따라 변수명이 자동으로 소문자로 변환될 수 있습니다.
    // 이 현상은 Jackson 같은 JSON 직렬화 라이브러리에서 발생할 수 있으며,
    // 기본 설정에서는 변수명을 소문자로 변환하는 경우가 있습니다.
    private String dDay;

    @PrePersist
    public void postDate() {
        postDate = new Date();
    }
}
