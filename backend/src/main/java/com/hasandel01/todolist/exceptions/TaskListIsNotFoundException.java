package com.hasandel01.todolist.exceptions;

public class TaskListIsNotFoundException extends RuntimeException {
    public TaskListIsNotFoundException(String message) {
        super(message);
    }
}
