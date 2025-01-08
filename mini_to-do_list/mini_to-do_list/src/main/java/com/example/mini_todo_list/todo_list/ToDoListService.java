package com.example.mini_todo_list.todo_list;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ToDoListService {

    @Autowired
    private ToDoListDao toDoListDao;

    public ToDoListDto saveToDo(ToDoListDto toDoListDto) {

        ToDoList entity = toDoListDao.save(new ToDoList(toDoListDto.getNumber(),
                toDoListDto.getToDo(), toDoListDto.getDetails(),
                toDoListDto.getWriter(), toDoListDto.getPostDate(), toDoListDto.getDDay()));

        return new ToDoListDto(entity.getNumber(), entity.getToDo(),
                entity.getDetails(), entity.getWriter(), entity.getPostDate(), entity.getDDay());
    }

    public List<ToDoListDto> getToDoList() {

        List<ToDoList> tmp = toDoListDao.findAll();
        List<ToDoListDto> toDoList = new ArrayList<>();

        for (ToDoList entity : tmp) {
            toDoList.add(new ToDoListDto(entity.getNumber(), entity.getToDo(),
                    entity.getDetails(), entity.getWriter(), entity.getPostDate(), entity.getDDay()));
        }

        return toDoList;
    }

    public ToDoListDto getToDoByNumber(int number) {
        ToDoList toDoList = toDoListDao.findById(number).orElse(null);

        if (toDoList != null) {
            return new ToDoListDto(toDoList.getNumber(), toDoList.getToDo(),
                    toDoList.getDetails(), toDoList.getWriter(),
                    toDoList.getPostDate(), toDoList.getDDay());
        }
        return null;
    }

    public void deleteToDoByNum(int number) {
        toDoListDao.deleteById(number);
    }
}
