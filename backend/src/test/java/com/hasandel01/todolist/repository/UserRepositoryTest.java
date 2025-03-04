package com.hasandel01.todolist.repository;

import com.hasandel01.todolist.model.Role;
import com.hasandel01.todolist.model.Task;
import com.hasandel01.todolist.model.TaskList;
import com.hasandel01.todolist.model.User;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskListRepository taskListRepository;

    private User user;

    @Transactional
    @BeforeEach
    void setUp() {

        user = User.builder()
                .email("Test email")
                .password("Test password")
                .profilePictureUrl("Test URL")
                .role(Role.USER)
                .username("Test username")
                .taskLists(new ArrayList<>())
                .build();

        userRepository.save(user);

        TaskList taskList = new TaskList();
        taskList.setTitle("Task 1");
        taskList.setUser(user);

        user.getTaskLists().add(taskList);

        taskListRepository.save(taskList);
    }

    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
        taskListRepository.deleteAll();
    }

    @Test
    void userShouldBeSaved() {
        assertNotNull(user.getId());
    }

    @Test
    void findByUsername_ShouldReturnUser() {

        User userReturned = userRepository.findByUsername("Test username").orElseThrow(
                () -> new RuntimeException("User Not Found")
        );

        assertEquals(userReturned.getId(), user.getId());
    }

    @Test
    void findByEmail_ShouldReturnUser() {

        User userReturned = userRepository.findByEmail("Test email").orElseThrow(
                () -> new RuntimeException("User Not Found")
        );
        assertEquals(userReturned.getId(), user.getId());
    }

    @Test
    void findByUsername_ShouldThrowException() {

        assertThrows(RuntimeException.class, () -> userRepository.findByUsername("XXX").orElseThrow(
                () -> new RuntimeException("User Not Found")
        ));
    }

    @Test
    void findByEmail_ShouldThrowException() {
        userRepository.save(user);
        assertThrows(RuntimeException.class, () -> userRepository.findByEmail("XxX").orElseThrow(
                () -> new RuntimeException("User Not Found")
        ));
    }
}