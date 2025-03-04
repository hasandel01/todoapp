package com.hasandel01.todolist.repository;

import com.hasandel01.todolist.model.*;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;


@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskListRepository taskListRepository;

    @Autowired
    private UserRepository userRepository;

    private Task task;

    private TaskList taskList;

    private User user;


    @BeforeEach
    void setUp() {

        user = User.builder()
                .email("Test email")
                .password("Test password")
                .role(Role.USER)
                .username("Test username")
                .profilePictureUrl("Test URL")
                .build();

        taskList = new TaskList();
        taskList.setTitle("Test Title");
        taskList.setUser(user);

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

    }


    @Test
    @Transactional
    public void taskRepositoryShouldAddANewTask() {

        userRepository.save(user);
        taskListRepository.save(taskList);

        Task savedTask = taskRepository.save(task);

        assertNotNull(savedTask.getId());
        assertEquals(task.getTitle(), savedTask.getTitle());
    }

}