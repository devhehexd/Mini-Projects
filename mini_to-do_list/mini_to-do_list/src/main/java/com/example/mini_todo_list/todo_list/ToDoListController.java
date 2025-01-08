package com.example.mini_todo_list.todo_list;

import com.example.mini_todo_list.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class ToDoListController {

    @Autowired
    private ToDoListService toDoListService;

    @PostMapping("/post")
    public Map postToDo(ToDoListDto toDoListDto) {

        Map map = new HashMap<>();
        boolean isPosted = false;

        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println(authentication.getName());
            User user = new User(authentication.getName(), "", "");
            toDoListDto.setWriter(user);
            toDoListService.saveToDo(toDoListDto);
            isPosted = true;
        } catch (Exception e) {
            System.out.println(toDoListDto);
            e.printStackTrace();
        }
        map.put("isPosted", isPosted);

        return map;
    }

    @GetMapping("/")
    public Map getToDoList() {
        Map map = new HashMap();
        map.put("toDoList", toDoListService.getToDoList());
        return map;
    }

    @GetMapping("/details/{postnum}")
    public Map toDoDetails(@PathVariable("postnum") int number) {
        Map map = new HashMap();
        ToDoListDto toDoDetails = toDoListService.getToDoByNumber(number);
        map.put("toDoDetails", toDoDetails);
        return map;
    }

    @PutMapping("/details/{postnum}")
    public Map updateToDo(@PathVariable("postnum") int number, @RequestBody ToDoListDto toDo) {

        Map map = new HashMap();
        boolean isUpdated = true;

        ToDoListDto currentToDo = toDoListService.getToDoByNumber(number);
        currentToDo.setToDo(toDo.getToDo());
        currentToDo.setDetails(toDo.getDetails());
        currentToDo.setDDay(toDo.getDDay());

        try {
            toDoListService.saveToDo(currentToDo);
        }catch (Exception e) {
            System.out.println(e);
            isUpdated = false;
        }

        map.put("isUpdated", isUpdated);
        return map;
    }

    @DeleteMapping("/{postnum}")
    public Map deleteToDo(@PathVariable("postnum") int number) {

        Map map = new HashMap();
        boolean isDeleted = true;

        try {
            toDoListService.deleteToDoByNum(number);
        }catch (Exception e) {
            System.out.println(e);
            isDeleted = false;
        }
        map.put("isDeleted", isDeleted);
        return map;
    }
}
