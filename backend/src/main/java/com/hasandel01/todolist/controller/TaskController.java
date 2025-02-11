package com.hasandel01.todolist.controller;


import com.hasandel01.todolist.model.Task;
import com.hasandel01.todolist.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping()
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @PostMapping("/task-list/{id}/task")
    public ResponseEntity<Task> addTask(@RequestBody Task task, @PathVariable Long id) {
        Task savedTask = this.taskService.addTaskToTheList(id,task);
        return ResponseEntity.ok(savedTask);
    }

    @DeleteMapping("/task-list/{taskListId}/task/{taskId}")
    public ResponseEntity<Task> deleteTask(@PathVariable Long taskListId, @PathVariable Long taskId) {
        return ResponseEntity.ok(this.taskService.deleteTask(taskListId,taskId));
    }

}
