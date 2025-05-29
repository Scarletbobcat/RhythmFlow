package com.rhythmflow.users.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NonNull;

import java.util.UUID;

@Data
@Entity
@Table(schema="user_metadata", name="users")
public class User {
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID id;

    private String email;

    private String artistName;

    private String profilePictureUrl;
}
