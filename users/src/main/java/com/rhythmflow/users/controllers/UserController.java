package com.rhythmflow.users.controllers;

import com.rhythmflow.users.entities.User;
import com.rhythmflow.users.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
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

        return userService.findUserByEmail(email);
    }

    @GetMapping("/id")
    public User getUserById(@RequestParam("id") String id) {
        return userService.findUserById(id);
    }

    @GetMapping("/supabaseId")
    public User getUserBySupabaseId(@RequestParam("supabaseId") String supabaseId) {
        return userService.findUserBySupabaseId(supabaseId);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        User existingUser = userService.findUserByEmail(user.getEmail());
        if (existingUser != null) {
            return ResponseEntity.badRequest().body("User already exists");
        }
        userService.createUser(user);
        return ResponseEntity.ok("User created successfully");
    }
    // @DeleteMapping("/delete")
    // public ResponseEntity<?> deleteUser(HttpServletRequest req) {
    //     if (userService.deleteUser(req.getHeader("X-User-Id"))) {
    //         return ResponseEntity.ok("User deleted successfully");
    //     }
    //     return ResponseEntity.badRequest().build();
    // }
}
