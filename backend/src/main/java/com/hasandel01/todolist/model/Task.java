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

    @Column(nullable = true)
    private String description;

    @FutureOrPresent(message = "Due date cannot be in the past.")
    @Column(nullable = false)
    private LocalDateTime dueTime;

    private boolean completed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    private boolean isRecurring;

    @Enumerated(EnumType.STRING)
    private RecurrencePattern recurrencePattern;

    @ManyToOne
    @JsonBackReference("task-previous")
    @JoinColumn(name = "previous_task_id")
    private Task previousTask;

    @OneToMany(mappedBy = "previousTask", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("task-previous")
    private List<Task> tasks;


    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "task_list_id", nullable = false)
    @JsonBackReference 
    private TaskList taskList;

}
