package com.hasandel01.todolist.service;


import com.hasandel01.todolist.model.Task;
import com.hasandel01.todolist.model.TaskList;
import com.hasandel01.todolist.repository.TaskListRepository;
import com.hasandel01.todolist.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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
                    .orElseThrow(() -> new EntityNotFoundException("Task list does not exist"));
            task.setTaskList(taskList);
            return taskRepository.save(task);
        }

    public void deleteTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                        .orElseThrow(() -> new EntityNotFoundException("Task does not exist"));

        TaskList taskList = task.getTaskList();
        taskList.getTasks().remove(task);
        taskRepository.delete(task);
    }

    public Task updateATask(Long taskListId, Long taskId, Task updatedTask) {

        if(!taskListRepository.existsById(taskListId))
                throw new RuntimeException("TaskList does not exist");

        Task task = taskRepository.findById(taskId)
                        .orElseThrow(() -> new RuntimeException("Task does not exist"));

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setDueDate(updatedTask.getDueDate());
        task.setCompleted(updatedTask.isCompleted());
        task.setPriority(updatedTask.getPriority());
        return taskRepository.save(task);
    }
}
