package com.hasandel01.todolist.model;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;


@Data
@Entity
@Table(name = "task_list")
public class TaskList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Title is required.")
    private String title;

    @OneToMany(mappedBy = "taskList", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Task> tasks;
}
