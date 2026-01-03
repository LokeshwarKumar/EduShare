package com.edumat.controller;

import com.edumat.model.User;
import com.edumat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/admin-check")
    public ResponseEntity<Map<String, Object>> checkAdminUser() {
        Map<String, Object> response = new HashMap<>();
        
        Optional<User> adminUser = userRepository.findByUsername("admin");
        if (adminUser.isPresent()) {
            User user = adminUser.get();
            response.put("adminFound", true);
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("storedPassword", user.getPassword());
            response.put("roles", user.getRoles().stream()
                    .map(role -> role.getName().toString())
                    .toList());
            
            // Test password matching
            boolean passwordMatches = passwordEncoder.matches("password123", user.getPassword());
            response.put("passwordMatches", passwordMatches);
            
        } else {
            response.put("adminFound", false);
        }
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/test-login")
    public ResponseEntity<Map<String, Object>> testLogin(@RequestBody Map<String, String> loginRequest) {
        Map<String, Object> response = new HashMap<>();
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            User foundUser = user.get();
            boolean passwordMatches = passwordEncoder.matches(password, foundUser.getPassword());
            
            response.put("userFound", true);
            response.put("username", foundUser.getUsername());
            response.put("passwordMatches", passwordMatches);
            response.put("roles", foundUser.getRoles().stream()
                    .map(role -> role.getName().toString())
                    .toList());
        } else {
            response.put("userFound", false);
        }
        
        return ResponseEntity.ok(response);
    }
}
