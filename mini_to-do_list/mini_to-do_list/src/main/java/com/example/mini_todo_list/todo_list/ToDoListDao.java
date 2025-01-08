package com.example.mini_todo_list.todo_list;

import com.example.mini_todo_list.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ToDoListDao extends JpaRepository<ToDoList, Integer> {

}
