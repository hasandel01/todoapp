package com.hasandel01.todolist.repository;

import com.hasandel01.todolist.model.Role;
import com.hasandel01.todolist.model.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .username("Test username")
                .password("Test password")
                .email("Test email")
                .profilePictureUrl("Test URL")
                .role(Role.USER)
                .taskLists(null)
                .build();
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void save() {
        userRepository.save(user);
    }

    @Test
    void findByUsername() {
    }

    @Test
    void findByEmail() {
    }
}