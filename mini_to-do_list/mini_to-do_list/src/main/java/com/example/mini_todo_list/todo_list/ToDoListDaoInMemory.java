//package com.example.mini_todo_list.todo_list;
//
//import org.springframework.stereotype.Repository;
//
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.Comparator;
//import java.util.List;
//
//@Repository
//public class ToDoListDaoInMemory {
//
//    private List<ToDoList> toDoList = new ArrayList<>();
//
//    public void insert(ToDoList toDo) {
//        toDoList.add(toDo);
//    }
//
//    public List<ToDoList> selectAll() {
//        Collections.sort(toDoList, new Comparator<ToDoList>() {
//            @Override
//            public int compare(ToDoList o1, ToDoList o2) {
//                return Integer.compare(o1.getNumber(), o2.getNumber());
//            }
//        });
//        return toDoList;
//    }
//
//    public void update(int index, ToDoList editedToDo) {
//        ToDoList currentToDo = toDoList.get(index);
//        currentToDo.setNumber(editedToDo.getNumber());
//        currentToDo.setToDo(editedToDo.getToDo());
//        currentToDo.setDetails(editedToDo.getDetails());
//    }
//
//    public ToDoList findByNumber(int number) {
//        for (int i = 0; i < toDoList.size(); i++) {
//            if (number == toDoList.get(i).getNumber()) {
//                return toDoList.get(i);
//            }
//        }
//        return null;
//    }
//
//    public int findIndex(int number) {
//        int index = 0;
//        for (int i = 0; i < toDoList.size(); i++) {
//            if (number == toDoList.get(i).getNumber()) {
//                index = i;
//            }
//        }
//        return index;
//    }
//
//    public void delete(int number) {
//        toDoList.remove(findByNumber(number));
//    }
//}
