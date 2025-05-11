package com.rhythmflow.users.services;

import com.rhythmflow.users.entities.User;
import com.rhythmflow.users.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User findUserById(String id) {
        return userRepository.findById(UUID.fromString(id)).orElse(null);
    }

    public void createUser(User user) {
        userRepository.save(user);
    }
}
