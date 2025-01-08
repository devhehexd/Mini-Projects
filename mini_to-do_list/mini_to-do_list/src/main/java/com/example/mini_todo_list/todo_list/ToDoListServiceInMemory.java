//package com.example.mini_todo_list.todo_list;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class ToDoListService {
//
//    @Autowired
//    ToDoListDaoInMemory toDoListDaoInMemory;
//
//    public void addToDo(ToDoList toDo) {
//        toDoListDaoInMemory.insert(toDo);
//    }
//
//    public List<ToDoList> getToDoList() {
//        return toDoListDaoInMemory.selectAll();
//    }
//
//    public ToDoList getByNumber(int number) {
//        return toDoListDaoInMemory.findByNumber(number);
//    }
//
//    public void editToDo(int index, ToDoList editedToDo) {
//        toDoListDaoInMemory.update(index, editedToDo);
//    }
//
//    public int findIndex(int number) {
//       return toDoListDaoInMemory.findIndex(number);
//    }
//
//    public void deleteToDo(int number) {
//        toDoListDaoInMemory.delete(number);
//    }
//}
