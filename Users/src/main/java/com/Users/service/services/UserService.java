package com.Users.service.services;

import com.Users.service.entities.User;
import com.Users.service.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        return user;
    }
}
