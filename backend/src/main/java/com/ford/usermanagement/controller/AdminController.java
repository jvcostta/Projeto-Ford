package com.ford.usermanagement.controller;

import com.ford.usermanagement.model.User;
import com.ford.usermanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetAdminPassword() {
        try {
            User admin = userRepository.findByEmail("admin@ford.com").orElse(null);
            if (admin != null) {
                admin.setPassword(passwordEncoder.encode("NewPass123!"));
                userRepository.save(admin);
                return ResponseEntity.ok("Password reset successfully");
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
