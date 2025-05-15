package com.rhythmflow.users.dtos;

import lombok.Data;

@Data
public class UserEvent {
    private String userId;
    private String eventType;
}
