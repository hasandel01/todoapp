package com.hasandel01.todolist.dto;

import lombok.Builder;

@Builder
public record UserDTO(String username, String email, String profilePictureUrl) {
}
