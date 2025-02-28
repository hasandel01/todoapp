package com.hasandel01.todolist.controller;


import com.hasandel01.todolist.dto.UserDTO;
import com.hasandel01.todolist.auth.model.AuthenticationRequest;
import com.hasandel01.todolist.auth.model.AuthenticationResponse;
import com.hasandel01.todolist.auth.model.RegisterRequest;
import com.hasandel01.todolist.model.User;
import com.hasandel01.todolist.repository.UserRepository;
import com.hasandel01.todolist.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;


    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authenticationService.register(registerRequest));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest authenticationRequest)
    {
        return ResponseEntity.ok(authenticationService.authenticate(authenticationRequest));

    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getUserDetails() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = (User) userDetailsService.loadUserByUsername(username);
        return ResponseEntity.ok(new UserDTO(user.getUsername(), user.getEmail(), user.getProfilePictureUrl()));
    }


    @PostMapping("/check-user")
    public ResponseEntity<UserDTO> checkUser(@RequestBody Map<String,String> payload) {
        try {
            String username = payload.get("username");
            User user = (User) userDetailsService.loadUserByUsername(username);
                return ResponseEntity.ok(new UserDTO(user.getUsername(), user.getEmail(), user.getProfilePictureUrl()));
        }catch (UsernameNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update")
    public ResponseEntity<AuthenticationResponse> update(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(AuthenticationResponse.builder().build());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        try {
                userRepository.findByEmail(email);
                return ResponseEntity.ok().build();
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
