package com.ford.usermanagement.controller;

import com.ford.usermanagement.dto.*;
import com.ford.usermanagement.model.User;
import com.ford.usermanagement.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Usuários", description = "Endpoints para gerenciamento de usuários")
public class UserController {

    @Autowired
    private AuthService authService;

    @GetMapping("/profile")
    @Operation(summary = "Obter perfil", description = "Retorna o perfil do usuário autenticado")
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UserResponse profile = authService.getUserProfile(user.getEmail());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    @Operation(summary = "Atualizar perfil", description = "Atualiza os dados do perfil do usuário")
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UserResponse updatedProfile = authService.updateProfile(user.getEmail(), request);
        return ResponseEntity.ok(updatedProfile);
    }

    @PutMapping("/password")
    @Operation(summary = "Alterar senha", description = "Altera a senha do usuário autenticado")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        authService.changePassword(user.getEmail(), request);
        return ResponseEntity.ok().build();
    }
}
