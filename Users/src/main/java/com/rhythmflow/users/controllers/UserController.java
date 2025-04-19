package com.rhythmflow.users.controllers;

import com.rhythmflow.users.entities.User;
import com.rhythmflow.users.services.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping ("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/email")
    public User getUserByEmail(@RequestParam("email") String email) {

        User user = userService.findUserByEmail(email);
        if (user != null) {
            return user;
        }
        return null;
    }
}
