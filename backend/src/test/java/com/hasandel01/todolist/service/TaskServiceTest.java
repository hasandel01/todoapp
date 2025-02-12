package com.hasandel01.todolist.service;

import com.hasandel01.todolist.model.Priority;
import com.hasandel01.todolist.model.Task;
import com.hasandel01.todolist.model.TaskList;
import com.hasandel01.todolist.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@DataJpaTest
class TaskServiceTest {

    private Task task;
    private TaskList taskList;

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;


    @BeforeEach
    void setUp() {
        task = new Task();
        task.setId(1L);
        task.setTitle("Test title");
        task.setDescription("Test description");
        task.setCompleted(true);
        task.setPriority(Priority.MEDIUM);

        // Initialize Task and TaskList
        taskList = new TaskList(); // Create a TaskList object
        List<Task> initialTaskList = new ArrayList<>();
        initialTaskList.add(task);
        taskList.setId(1L); // Assign an ID to the task list
        taskList.setTasks(initialTaskList);
        task.setTaskList(taskList);  // Associate the task with the taskList

    }

    @Test
    void deleteTask_ShouldDeleteTaskSuccessfully() {

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        taskService.deleteTask(1L);
        verify(taskRepository).delete(task);
    }
}