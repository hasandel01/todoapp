package com.hasandel01.todolist.service;

import com.hasandel01.todolist.model.*;
import com.hasandel01.todolist.repository.TaskListRepository;
import com.hasandel01.todolist.repository.TaskRepository;
import com.hasandel01.todolist.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
class TaskListServiceTest {

    @Mock
    private TaskListRepository taskListRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskListService taskListService;

    private TaskList taskList;

    private User user;

    private Task task;



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
    }

    @Test
    void getAllTaskLists_ShouldReturnAllTaskLists() {

        //Assign
        when(taskListRepository.findByUser(user)).thenReturn(List.of(taskList));

    }

    @Test
    void createTaskList() {
    }

    @Test
    void getTaskListById() {
    }

    @Test
    void deleteTaskListByTitle() {
    }

    @Test
    void editTaskList() {
    }
}