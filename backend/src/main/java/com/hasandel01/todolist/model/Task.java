package com.hasandel01.todolist.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


@Data
@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String title;

    private String description;

    private LocalDate dueDate;

    private boolean completed;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "task_list_id", nullable = false)
    @JsonBackReference // This tells Jackson to ignore the taskList property when serializing Task
    private TaskList taskList;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
