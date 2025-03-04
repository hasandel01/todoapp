package com.hasandel01.todolist.exceptions;

public class UserIsRegisteredException extends RuntimeException {
    public UserIsRegisteredException(String message) {
        super(message);
    }
}
