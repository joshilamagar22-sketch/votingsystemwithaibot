package com.voteai.service;

import com.voteai.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.voteai.dto.LoginRequest;
import com.voteai.entity.User;
import com.voteai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public User registerUser(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("ROLE_VOTER");
        }

        return userRepository.save(user);
    }

    public String loginUser(LoginRequest loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail());

        if (user == null) {
            return "User not found";
        }

        if (!passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPassword())) {

            return "Invalid password";
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return token;
    }
}
