//package com.example.mini_todo_list.todo_list;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@CrossOrigin(origins = "*")
//public class ToDoListControllerInMemory {
//
//    @Autowired
//    ToDoListService toDoListService;
//
//    @PostMapping("/post")
//    public void postToDo(ToDoList toDo) {
//        toDoListService.addToDo(toDo);
//    }
//
//    @GetMapping("/")
//    public List<ToDoList> getToDoList() {
//       return toDoListService.getToDoList();
//    }
//
//    @GetMapping("/tododetails/{todonum}")
//    public Map getToDoByNumber(@PathVariable("todonum") int number) {
//        Map map = new HashMap();
//        ToDoList toDo = toDoListService.getByNumber(number);
//        map.put("toDoDetails", toDo);
//        return map;
//    }
//
//    @PutMapping("/tododetails/{todonum}")
//    public void editToDo(@PathVariable("todonum") int number, @RequestBody ToDoList editedToDo) {
//
//        int index = toDoListService.findIndex(number);
//        System.out.println(index);
//
//        ToDoList prevTodolist = toDoListService.getByNumber(number);
//        prevTodolist.setNumber(editedToDo.getNumber());
//        prevTodolist.setToDo(editedToDo.getToDo());
//        prevTodolist.setDetails(editedToDo.getDetails());
//
//        toDoListService.editToDo(index, prevTodolist);
//    }
//
//    @DeleteMapping("/tododetails/{todonum}")
//    public void deleteToDo(@PathVariable("todonum") int number) {
//        toDoListService.deleteToDo(number);
//    }
//}
