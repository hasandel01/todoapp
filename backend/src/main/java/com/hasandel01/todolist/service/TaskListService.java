package com.hasandel01.todolist.service;


import com.hasandel01.todolist.exceptions.TaskListIsNotFoundException;
import com.hasandel01.todolist.model.Task;
import com.hasandel01.todolist.model.TaskList;
import com.hasandel01.todolist.repository.TaskListRepository;
import com.hasandel01.todolist.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskListService {

    private final TaskListRepository taskListRepository;

    public List<TaskList> getAllTaskLists() {
        return taskListRepository.findAll();
    }

    @Transactional
    public TaskList createTaskList(String title) {
        TaskList newTaskList = new TaskList();
        newTaskList.setTitle(title);
        this.taskListRepository.save(newTaskList);
        return newTaskList;
    }

    public Optional<TaskList> getTaskListById(Long id) {
        return taskListRepository.findById(id);
    }

    public void deleteTaskListByTitle(String title) throws EntityNotFoundException {
        TaskList taskList =taskListRepository.findByTitle(title)
                .orElseThrow(() -> new EntityNotFoundException("TaskList with title " + title + " not found"));
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
