package com.ford.usermanagement.config;

import com.ford.usermanagement.model.User;
import com.ford.usermanagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuração para inicialização de dados padrão da aplicação.
 * Este componente garante que usuários de teste sejam criados automaticamente
 * quando a aplicação é iniciada, facilitando o processo de avaliação.
 */
@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public ApplicationRunner initDatabase() {
        return args -> {
            log.info("🚀 Iniciando configuração de dados padrão...");
            
            // Criar usuário administrador
            createUserIfNotExists(
                "Administrador Ford",
                "admin@ford.com", 
                "admin123",
                "Usuário administrador criado automaticamente para testes"
            );
            
            // Criar usuário comum
            createUserIfNotExists(
                "Usuário Ford",
                "user@ford.com", 
                "user123",
                "Usuário comum criado automaticamente para testes"
            );
            
            log.info("✅ Configuração de dados padrão concluída!");
            log.info("📋 Credenciais disponíveis:");
            log.info("   👤 Admin: admin@ford.com / admin123");
            log.info("   👤 User:  user@ford.com / user123");
        };
    }

    private void createUserIfNotExists(String name, String email, String plainPassword, String description) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(plainPassword));
            
            userRepository.save(user);
            log.info("✅ {} criado: {}", description, email);
        } else {
            log.info("ℹ️  Usuário já existe: {}", email);
        }
    }
}
