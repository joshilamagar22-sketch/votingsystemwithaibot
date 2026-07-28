package com.voteai.controller;

import com.voteai.entity.User;
import com.voteai.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public String home() {
        return "VoteAI Backend is Running!";
    }

    @PostMapping("/users/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }
}