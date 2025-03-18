package com.Users.service.controllers;

import com.Users.service.entities.User;
import com.Users.service.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping ("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/email")
    public User getUserByEmail(@RequestParam("email") String email) {

        User user = userService.findUserByEmail(email);
        if (user != null) {
            return user;
        }
        return null;
    }
}
