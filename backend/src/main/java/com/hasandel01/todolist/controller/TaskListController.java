package com.hasandel01.todolist.controller;


import com.hasandel01.todolist.model.TaskList;
import com.hasandel01.todolist.service.TaskListService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    @PostMapping
    public ResponseEntity<TaskList> addTaskList(@RequestBody TaskList taskList) {
        TaskList savedTaskList = this.taskListService.createTaskList(taskList);
        return ResponseEntity.ok(savedTaskList);
    }

}
