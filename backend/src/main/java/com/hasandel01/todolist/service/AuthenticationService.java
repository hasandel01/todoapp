package com.hasandel01.todolist.service;


import com.hasandel01.todolist.auth.model.AuthenticationRequest;
import com.hasandel01.todolist.auth.model.AuthenticationResponse;
import com.hasandel01.todolist.auth.model.RegisterRequest;
import com.hasandel01.todolist.dto.UserDTO;
import com.hasandel01.todolist.exceptions.UserIsRegisteredException;
import com.hasandel01.todolist.model.Role;
import com.hasandel01.todolist.model.User;
import com.hasandel01.todolist.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest registerRequest) {

        String bucketName = "todoapplication-ef2d3.firebasestorage.app";
        String downloadToken = java.util.UUID.randomUUID().toString();

        String publicUrl = "https://firebasestorage.googleapis.com/v0/b/" + bucketName + "/o/"
                + URLEncoder.encode("default_profile_picture.png", StandardCharsets.UTF_8)
                + "?alt=media&token=" + downloadToken;

        User user = userRepository.findByEmail(registerRequest.getEmail()).orElse(null);

        if(user != null) {
            throw new UserIsRegisteredException("User with " +
                    registerRequest.getEmail() + " is already registered.");
        }
        else {

            user = User.builder()
                    .username(registerRequest.getUsername())
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .email(registerRequest.getEmail())
                    .profilePictureUrl(publicUrl)
                    .role(Role.USER)
                    .build();

            userRepository.save(user);
        }

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authenticationRequest.getUsername(),
                        authenticationRequest.getPassword()
                )
        );
        var user = userRepository.findByUsername(authenticationRequest.getUsername()).orElseThrow(
                () -> new UsernameNotFoundException(authenticationRequest.getUsername()));

        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public UserDTO update(UserDTO userDTO) {

        User user = userRepository.findByUsername(userDTO.username()).orElseThrow(
                () -> new UsernameNotFoundException("User not found")
        );

        user.setEmail(userDTO.email());
        user.setUsername(userDTO.username());
        user.setProfilePictureUrl(userDTO.profilePictureUrl());
        userRepository.save(user);
        return UserDTO.builder()
                .username(userDTO.username())
                .email(userDTO.email())
                .profilePictureUrl(userDTO.profilePictureUrl())
                .build();
    }
}
