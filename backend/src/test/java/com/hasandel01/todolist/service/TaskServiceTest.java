package com.hasandel01.todolist.service;

import com.hasandel01.todolist.model.*;
import com.hasandel01.todolist.repository.TaskListRepository;
import com.hasandel01.todolist.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Incubating;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private TaskListRepository taskListRepository;

    @InjectMocks
    private TaskService taskService;

    @InjectMocks
    private TaskListService taskListService;

    private Task task;

    private TaskList taskList;

    @BeforeEach
    void setUp() {

        taskList = new TaskList();
        taskList.setId(1L);
        taskList.setTitle("Test TaskList Title");
        taskList.setTasks(new ArrayList<>());

        task = Task.builder()
                .completed(false)
                .description("Test Task Description")
                .title("Test Task Title")
                .isRecurring(true)
                .recurrencePattern(RecurrencePattern.DAILY)
                .priority(Priority.HIGH)
                .dueTime(LocalDateTime.now())
                .taskList(taskList)
                .build();

        taskList.getTasks().add(task);

        taskListRepository.save(taskList);

    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void addTaskToTheList_ShouldAddTaskToTheTaskList() {
        //Arrange
        when(taskListRepository.findById(1L)).thenReturn(Optional.of(taskList));
        when(taskRepository.save(task)).thenReturn(task);

        //Act
        Task addedTask = taskService.addTaskToTheList(1L, task);

        //Assert
        assertNotNull(addedTask);
        assertEquals(addedTask.getDescription(), "Test Task Description");
        assertEquals(addedTask.getTitle(), "Test Task Title");
        verify(taskRepository, times(1)).save(task);

    }

    @Test
    void addTaskToTheList_ShouldThrowEntityNotFoundException() {
        //Arrange
        when(taskListRepository.findById(2L)).thenReturn(Optional.empty());

        //Act & Assert
        assertThrows(EntityNotFoundException.class, () -> taskService.addTaskToTheList(2L, task));
    }

    @Test
    void deleteTask_ShouldDeleteTask() {

        //Arrange
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        //Act
        taskService.deleteTask(1L);

        //Assert
        verify(taskRepository, times(1)).delete(task);

    }

    @Test
    void deleteTask_ShouldThrowEntityNotFoundException() {
        //Arrange
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        //Act && Assert
        assertThrows(EntityNotFoundException.class, () -> taskService.deleteTask(1L));
    }

    @Test
    void updateATask_ShouldUpdateTask() {
        //Arrange
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(task)).thenReturn(task);

        //Act
        Task updatedTask = Task.builder()
                .completed(false)
                .description("Test Task Description Changed")
                .title("Test Task Title")
                .isRecurring(true)
                .recurrencePattern(RecurrencePattern.DAILY)
                .priority(Priority.HIGH)
                .dueTime(LocalDateTime.now())
                .taskList(taskList)
                .build();

        Task newUpdated = taskService.updateATask(1L, updatedTask);

        //Assert
        assertNotNull(newUpdated);
        assertEquals(newUpdated.getDescription(), updatedTask.getDescription());
        assertEquals(task.getId(), newUpdated.getId());
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    void completeATask_ShouldCompleteTask_WhenTaskIsNotRecurring() {

        // Arrange
        task.setRecurring(false);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(task)).thenReturn(task);

        // Act
        Task completedTask = taskService.completeATask(1L);

        // Assert
        assertNotNull(completedTask);
        assertTrue(completedTask.isCompleted());
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    void completeATask_ShouldCompleteTask_WhenTaskIsRecurring() {

        Task newTask = Task.builder()
                .completed(false)
                .description("Test Task Description")
                .title("Test Task Title")
                .isRecurring(true)
                .recurrencePattern(RecurrencePattern.DAILY)
                .priority(Priority.HIGH)
                .dueTime(task.getDueTime().plusDays(1))
                .taskList(taskList)
                .build();


        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(task)).thenReturn(task);
        when(taskRepository.save(newTask)).thenReturn(newTask);

        Task completedTask = taskService.completeATask(1L);

        assertNotNull(completedTask);
        assertTrue(task.isCompleted());
        assertFalse(completedTask.isCompleted());
        assertEquals(task.getRecurrencePattern(), newTask.getRecurrencePattern());
        assertEquals(task.isRecurring(), newTask.isRecurring());
        verify(taskRepository, times(2)).save(any(Task.class));
    }

    @Test
    void completeATask_ShouldThrowEntityNotFoundException() {

        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> taskService.completeATask(1L));
    }


}