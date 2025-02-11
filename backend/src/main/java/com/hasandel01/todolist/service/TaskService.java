package com.hasandel01.todolist.service;


import com.hasandel01.todolist.model.Task;
import com.hasandel01.todolist.model.TaskList;
import com.hasandel01.todolist.repository.TaskListRepository;
import com.hasandel01.todolist.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskListRepository taskListRepository;

    public TaskService(TaskRepository taskRepository, TaskListRepository taskListRepository) {
        this.taskRepository = taskRepository;
        this.taskListRepository = taskListRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }


    public Task addTaskToTheList(Long taskListId, Task task) {
            TaskList taskList = taskListRepository.findById(taskListId)
                    .orElseThrow(() -> new RuntimeException("Task list does not exist"));

            task.setTaskList(taskList);
            return taskRepository.save(task);
        }

    public Task deleteTask(Long taskListId, Long taskId) {
        TaskList taskList = taskListRepository.findById(taskListId)
                .orElseThrow(() -> new RuntimeException("TaskList does not exist"));
        Task task = taskRepository.findById(taskId)
                        .orElseThrow(() -> new RuntimeException("Task does not exist"));
        taskList.getTasks().remove(task);
        taskRepository.delete(task);
        return task;
    }
}
