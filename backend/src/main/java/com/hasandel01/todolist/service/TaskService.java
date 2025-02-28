package com.hasandel01.todolist.service;


import com.hasandel01.todolist.model.Task;
import com.hasandel01.todolist.model.TaskList;
import com.hasandel01.todolist.repository.TaskListRepository;
import com.hasandel01.todolist.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.FutureOrPresent;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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
            if (task.getDueTime() != null && task.getDueTime().getSecond() == 0) {
                task.setDueTime(task.getDueTime().withSecond(0).withNano(0));
            }
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

    public Task updateATask(Long taskId, Task updatedTask) {

        Task task = taskRepository.findById(taskId)
                        .orElseThrow(() -> new RuntimeException("Task does not exist"));

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setDueTime(updatedTask.getDueTime());
        task.setCompleted(updatedTask.isCompleted());
        task.setPriority(updatedTask.getPriority());
        task.setRecurring(updatedTask.isRecurring());
        task.setRecurrencePattern(updatedTask.getRecurrencePattern());
        return taskRepository.save(task);
    }


    public Task completeATask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task does not exist"));

        task.setCompleted(true);
        taskRepository.save(task);

        if(task.isRecurring() && task.getRecurrencePattern() != null) {
            Task newTask = createNewRecurringTask(task);
            return taskRepository.save(newTask);
        }

        return task;
    }

    private Task createNewRecurringTask(Task task) {

        Task newTask = new Task();

        newTask.setTitle(task.getTitle());
        newTask.setDescription(task.getDescription());
        newTask.setDueTime(calculateNewDueTime(task));
        newTask.setPriority(task.getPriority());
        newTask.setRecurrencePattern(task.getRecurrencePattern());
        newTask.setRecurring(true);
        newTask.setPreviousTask(task);
        newTask.setTaskList(task.getTaskList());

        return newTask;

    }

    private @FutureOrPresent(message = "Due date cannot be in the past.") LocalDateTime
    calculateNewDueTime(@FutureOrPresent(message = "Due date cannot be in the past.")
                        Task task) {

            switch (task.getRecurrencePattern()) {
                case DAILY -> {
                    return task.getDueTime().plusDays(1);
                }
                case WEEKLY -> {
                    return task.getDueTime().plusWeeks(1);
                }
                case MONTHLY -> {
                    return task.getDueTime().plusMonths(1);
                }
                default -> throw new RuntimeException("Invalid recurrence pattern");
            }
    }
}
