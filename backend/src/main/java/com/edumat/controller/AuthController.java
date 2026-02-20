package com.edumat.controller;

import com.edumat.dto.JwtResponse;
import com.edumat.dto.LoginRequest;
import com.edumat.dto.MessageResponse;
import com.edumat.dto.SignupRequest;
import com.edumat.model.ERole;
import com.edumat.model.Role;
import com.edumat.model.User;
import com.edumat.repository.RoleRepository;
import com.edumat.repository.UserRepository;
import com.edumat.security.JwtUtils;
import com.edumat.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Authentication Controller
 * 
 * Handles user authentication and registration endpoints:
 * - POST /api/auth/signin - User login
 * - POST /api/auth/signup - User registration  
 * - GET /api/auth/me - Get current user info
 * 
 * @author EduShare Team
 * @version 1.0.0
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    // ==================== DEPENDENCIES ====================
    
    /** Authentication manager for user login validation */
    @Autowired
    private AuthenticationManager authenticationManager;

    /** User data access layer */
    @Autowired
    private UserRepository userRepository;

    /** Role data access layer */
    @Autowired
    private RoleRepository roleRepository;

    /** Password encoder for secure password hashing */
    @Autowired
    private PasswordEncoder encoder;

    /** JWT utility for token generation and validation */
    @Autowired
    private JwtUtils jwtUtils;

    // ==================== API ENDPOINTS ====================
    
    /**
     * User authentication endpoint
     * 
     * @param loginRequest User login credentials (username, password)
     * @return JWT token with user details
     */
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        // Authenticate user credentials
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        // Set authentication in security context
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Generate JWT token
        String jwt = jwtUtils.generateJwtToken(authentication);

        // Extract user details from authentication
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Convert user roles to string list
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        // Return JWT response with user details
        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getFirstName(),
                userDetails.getLastName(),
                roles));
    }

    /**
     * User registration endpoint
     * 
     * @param signUpRequest User registration details (username, email, password, etc.)
     * @return Success message or error response
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        
        // Check if username is already taken
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Check if email is already in use
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user entity
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        user.setDepartment(signUpRequest.getDepartment());
        user.setSemester(signUpRequest.getSemester());

        // Assign default USER role
        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);
        
        // Save user to database
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    /**
     * Get current authenticated user information
     * 
     * @param authentication Spring Security authentication object
     * @return Current user details with roles
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            // Extract user details from authentication
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            // Fetch full user entity from database
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Create response with user details and roles
            JwtResponse response = new JwtResponse(
                    null, // No token needed for this endpoint
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getRoles().stream()
                            .map(role -> role.getName().toString())
                            .collect(Collectors.toList())
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error getting user info: " + e.getMessage()));
        }
    }
}
