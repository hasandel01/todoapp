package com.hasandel01.todolist.service;

import com.hasandel01.todolist.exceptions.UserNotAuthenticatedException;
import com.hasandel01.todolist.model.TaskList;
import com.hasandel01.todolist.model.User;
import com.hasandel01.todolist.repository.TaskListRepository;
import com.hasandel01.todolist.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskListService {

    private final TaskListRepository taskListRepository;

    private final UserRepository userRepository;

    public List<TaskList> getAllTaskLists() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return taskListRepository.findByUser(user);
    }

    @Transactional
    public TaskList createTaskList(String title) throws UserNotAuthenticatedException {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        user = userRepository.findById(user.getId())
                .orElseThrow(() -> new UserNotAuthenticatedException("User not found"));

        TaskList newTaskList = new TaskList();
        newTaskList.setTitle(title);
        newTaskList.setUser(user);
        this.taskListRepository.save(newTaskList);
        return newTaskList;
    }

    public Optional<TaskList> getTaskListById(Long id) {
        return taskListRepository.findById(id);
    }

    public void deleteTaskListByTitle(Long id) throws EntityNotFoundException {
        TaskList taskList =taskListRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("TaskList with id " + id + " not found"));
        taskListRepository.delete(taskList);
    }

    public TaskList editTaskList(Long id, String title) throws EntityNotFoundException {

        TaskList taskList = taskListRepository.findById(id)
                        .orElseThrow(() -> new EntityNotFoundException("TaskList with id " + id + " not found"));
        taskList.setTitle(title);
        this.taskListRepository.save(taskList);
        return taskList;
    }
}
