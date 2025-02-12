package com.hasandel01.todolist.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hasandel01.todolist.model.Priority;
import com.hasandel01.todolist.model.Task;
import com.hasandel01.todolist.service.TaskService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(controllers = TaskController.class)
@AutoConfigureMockMvc
@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;  // Mock the service layer

    @InjectMocks
    private TaskController taskController;

    private Task task;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        task = new Task();
        task.setId(1L);
        task.setTitle("Test title");
        task.setDescription("Test description");
        task.setCompleted(true);
        task.setPriority(Priority.MEDIUM);

    }

    @Test
    void addTaskToTheList_ShouldReturnTask() throws Exception {
        //Arrange
        when(taskService.addTaskToTheList(1L, task)).thenReturn(task);

        //Act
        mockMvc.perform(post("/task-list/{id}/task", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.description").value("Test description"))
                .andExpect(jsonPath("$.title").value("Test title"))
                .andExpect(jsonPath("$.completed").value(true))
                .andExpect(jsonPath("$.priority").value("MEDIUM"))
                .andExpect(jsonPath("$.id").value(1L));

        verify(taskService).addTaskToTheList(1L, task);

    }

    @Test
    void deleteTask_ShouldReturnNoContent() throws Exception {

        mockMvc.perform(delete("/task/{taskId}",  1L))
                .andExpect(status().isNoContent());

        verify(taskService).deleteTask(1L);
    }

    @Test
    void deleteTask_ShouldReturnNotFound_WhenEntityNotFoundException() throws Exception {
        // Arrange: mock the service to throw EntityNotFoundException
        doThrow(new EntityNotFoundException("Task does not exist")).when(taskService).deleteTask(3L);

        // Act & Assert: make the delete request and expect a 404 Not Found status
        mockMvc.perform(delete("/task/{taskId}", 3L))
                .andExpect(status().isNotFound());

        // Verify that the service method was called with the correct argument
        verify(taskService).deleteTask(3L);
    }

    @Test
    void deleteTask_ShouldThrowInternalServerError_WhenAnyExceptionIsThrown() throws Exception {

        //Arrange
        doThrow(new RuntimeException("Any exception")).when(taskService).deleteTask(4L);

        // Act & Assert
        mockMvc.perform(delete("/task/{taskId}", 4L))
                .andExpect(status().isInternalServerError());

        //Assert
        verify(taskService).deleteTask(4L);
    }

    @Test
    void deleteTask_ShouldReturnBadRequest_WhenTaskIdIsInvalid() throws Exception {
        // Arrange: no specific mocking required, just test an invalid ID
        mockMvc.perform(delete("/task/{taskId}", "invalid"))
                .andExpect(status().isBadRequest());
    }



    @Test
    void updateTask_ShouldReturnTrue() throws Exception {

        Task updatedTask = new Task();
        updatedTask.setId(1L);
        updatedTask.setTitle("Test updated");
        updatedTask.setDescription("Test updated");
        updatedTask.setCompleted(true);
        updatedTask.setPriority(Priority.MEDIUM);

        when(taskService.updateATask(1L,1L,task)).thenReturn(updatedTask);

        mockMvc.perform(put("task-list/{taskListId}/task/{taskId}", 1L, 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedTask)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test updated"))
                .andExpect(jsonPath("$.id").value(1L));

        verify(taskService).updateATask(1L,1L,task);
    }



    @AfterEach
    void tearDown() {
    }

    @Test
    void getAllTasks() {
    }

    @Test
    void addTask() {
    }

    @Test
    void deleteTask() {
    }
}