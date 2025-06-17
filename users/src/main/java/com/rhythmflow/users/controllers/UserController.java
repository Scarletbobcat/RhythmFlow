package com.rhythmflow.users.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rhythmflow.users.dtos.UserDto;
import com.rhythmflow.users.entities.User;
import com.rhythmflow.users.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

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

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok().build();
    }


    @GetMapping("/id")
    public UserDto getUserById(@RequestParam("id") String id) {
        return userService.findUserById(id);
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
     @DeleteMapping("/delete")
     public ResponseEntity<?> deleteUser(HttpServletRequest req, @RequestParam("id") String id) {
         if (userService.deleteUser(req.getHeader("X-User-Id"), id)) {
             return ResponseEntity.ok("User deleted successfully");
         }
         return ResponseEntity.badRequest().build();
     }

    @PostMapping("/update")
    public ResponseEntity<?> updateUser(
            HttpServletRequest req,
            @RequestPart(value="id") String id,
            @RequestPart(value="artistName") String artistName,
            @RequestPart(value="image", required = false) MultipartFile image
    ) {

         boolean success = userService.updateUser(req.getHeader("X-User-Id"), id, artistName, image);
         if (!success) {
             return ResponseEntity.badRequest().body("An error occurred while updating the user");
         }
        return ResponseEntity.ok("User updated successfully");
    }
}
