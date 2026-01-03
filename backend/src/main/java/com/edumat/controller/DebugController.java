package com.edumat.controller;

import com.edumat.model.User;
import com.edumat.repository.UserRepository;
import com.edumat.repository.RoleRepository;
import com.edumat.model.ERole;
import com.edumat.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (User user : users) {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("firstName", user.getFirstName());
            userMap.put("lastName", user.getLastName());
            userMap.put("department", user.getDepartment());
            userMap.put("semester", user.getSemester());
            
            // Get roles
            Set<Role> roles = user.getRoles();
            List<String> roleNames = new ArrayList<>();
            for (Role role : roles) {
                roleNames.add(role.getName().toString());
            }
            userMap.put("roles", roleNames);
            
            result.add(userMap);
        }
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/test-password")
    public ResponseEntity<Map<String, Object>> testPassword() {
        String rawPassword = "password123";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        
        Map<String, Object> result = new HashMap<>();
        result.put("raw", rawPassword);
        result.put("encoded", encodedPassword);
        
        // Check if admin user exists and compare passwords
        Optional<User> adminUser = userRepository.findByUsername("admin");
        if (adminUser.isPresent()) {
            User user = adminUser.get();
            result.put("storedPassword", user.getPassword());
            result.put("passwordsMatch", passwordEncoder.matches(rawPassword, user.getPassword()));
            result.put("adminUserExists", true);
        } else {
            result.put("adminUserExists", false);
        }
        
        return ResponseEntity.ok(result);
    }

    @PostMapping("/create-admin")
    public ResponseEntity<Map<String, Object>> createAdmin() {
        // Check if admin already exists
        if (userRepository.existsByUsername("admin")) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Admin user already exists");
            return ResponseEntity.badRequest().body(error);
        }

        // Create admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@edumat.com");
        admin.setPassword(passwordEncoder.encode("password123"));
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setDepartment("Administration");

        // Get admin role
        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Admin role not found"));

        Set<Role> roles = new HashSet<>();
        roles.add(adminRole);
        admin.setRoles(roles);

        User savedUser = userRepository.save(admin);

        // Assign role
        // Note: In a real app, you'd handle this properly with UserRoles table
        // For debugging, we'll create a simple role assignment
        Map<String, Object> result = new HashMap<>();
        result.put("message", "Admin user created successfully");
        result.put("userId", savedUser.getId());
        result.put("username", savedUser.getUsername());
        result.put("roles", savedUser.getRoles().stream()
                .map(role -> role.getName().toString())
                .toList());

        return ResponseEntity.ok(result);
    }
}
