package com.hasandel01.todolist.controller;


import com.hasandel01.todolist.model.Task;
import com.hasandel01.todolist.service.TaskService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("")
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
        try{
            Task savedTask = this.taskService.addTaskToTheList(id,task);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedTask);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("task/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        try{
            this.taskService.deleteTask(taskId);
            return ResponseEntity.noContent().build();
       }catch (EntityNotFoundException e){
           return ResponseEntity.notFound().build();
       }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/task-list/{taskListId}/task/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskListId,
                                           @PathVariable Long taskId, @RequestBody Task task) {

        Task updatedTask = this.taskService.updateATask(taskListId,taskId,task);
        return ResponseEntity.status(HttpStatus.OK).body(updatedTask);
    }

}
