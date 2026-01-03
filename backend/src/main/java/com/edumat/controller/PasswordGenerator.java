package com.edumat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/password")
public class PasswordGenerator {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/generate")
    public ResponseEntity<Map<String, String>> generatePassword(@RequestParam String password) {
        Map<String, String> response = new HashMap<>();
        String encodedPassword = passwordEncoder.encode(password);
        response.put("password", password);
        response.put("hash", encodedPassword);
        
        // Test the hash immediately
        boolean matches = passwordEncoder.matches(password, encodedPassword);
        response.put("verification", matches ? "HASH_WORKS" : "HASH_FAILED");
        
        return ResponseEntity.ok(response);
    }
}
