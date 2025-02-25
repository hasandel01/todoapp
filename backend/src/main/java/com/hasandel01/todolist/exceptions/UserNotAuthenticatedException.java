package com.hasandel01.todolist.exceptions;

import org.jetbrains.annotations.NotNull;

public class UserNotAuthenticatedException extends RuntimeException {
    public UserNotAuthenticatedException(String userNotFound) {
    }
}
