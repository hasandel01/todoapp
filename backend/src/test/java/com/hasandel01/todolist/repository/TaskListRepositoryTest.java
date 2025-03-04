package com.hasandel01.todolist.repository;

import com.hasandel01.todolist.model.*;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
class TaskListRepositoryTest {

    @Autowired
    private TaskListRepository taskListRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    private User user;

    private TaskList taskList;

    private Task task;

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

        taskList = new TaskList();
        taskList.setTitle("TaskList 1");
        taskList.setUser(user);
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

        user.getTaskLists().add(taskList); /* !!! */

        taskListRepository.save(taskList);

        taskList.getTasks().add(task); /* !!! */

        taskRepository.save(task);
    }

    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
        taskListRepository.deleteAll();
    }

    @Test
    void findByUser_ShouldReturnTaskListsList() {

       List<TaskList> taskListList =  taskListRepository.findByUser(user);

       assertEquals(1, taskListList.size());
       assertEquals("TaskList 1", taskListList.get(0).getTitle());
    }

    @Test
    void saveTaskList_ShouldSaveTaskList() {

        taskListRepository.save(taskList);

        assertEquals("TaskList 1", taskList.getTitle());
        assertEquals("Test Task Title", taskList.getTasks().get(0).getTitle());

    }
}