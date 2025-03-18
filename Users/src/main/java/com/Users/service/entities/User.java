package com.Users.service.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(schema="auth", name = "users")
public class User {
    @Id
    @GeneratedValue(generator = "UUID")
    private String id;

    private String email;

    private String phone;

    private String role;
}
