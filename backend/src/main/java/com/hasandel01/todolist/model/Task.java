package com.hasandel01.todolist.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import lombok.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Data
@Entity
@EqualsAndHashCode(exclude = "taskList")
public class Task {

    @Setter
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required.")
    private String title;

    private String description;

    @FutureOrPresent(message = "Due date cannot be in the past.")
    private LocalDateTime dueTime;

    private boolean completed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    private boolean isRecurring;

    @Enumerated(EnumType.STRING)
    private RecurrencePattern recurrencePattern;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "task_list_id", nullable = false)
    @JsonBackReference 
    private TaskList taskList;

}
