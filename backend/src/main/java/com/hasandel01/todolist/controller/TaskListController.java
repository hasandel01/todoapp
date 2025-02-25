package com.hasandel01.todolist.controller;


import com.hasandel01.todolist.exceptions.TaskListIsNotFoundException;
import com.hasandel01.todolist.model.Task;
import com.hasandel01.todolist.model.TaskList;
import com.hasandel01.todolist.service.TaskListService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/task-list")
public class TaskListController {

    private final TaskListService taskListService;

    public TaskListController(TaskListService taskListService) {
        this.taskListService = taskListService;
    }

    @GetMapping
    public ResponseEntity<List<TaskList>> getTaskList() {
        return ResponseEntity.ok(taskListService.getAllTaskLists());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<TaskList>> getTaskListById(@PathVariable long id) {
        return ResponseEntity.ok(taskListService.getTaskListById(id));
    }

    @PostMapping("/add")
    public ResponseEntity<TaskList> addTaskList(@RequestBody Map<String,String> payload) {
        TaskList savedTaskList = this.taskListService
                        .createTaskList(payload.get("title"));
        return ResponseEntity.ok(savedTaskList);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteTaskList(@RequestBody Map<String,Long> payload) {
        try {
            this.taskListService.deleteTaskListByTitle(payload.get("id"));
            return ResponseEntity.noContent().build();
        }
        catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<TaskList> editTaskList(@PathVariable Long id, @RequestBody Map<String,String> payload) {
        try {
            return ResponseEntity.ok(this.taskListService.editTaskList(id,payload.get("title")));
        }
        catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }


}
