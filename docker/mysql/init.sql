-- Criação da tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Inserir usuário administrador com senha BCrypt válida
-- NewPass123! = $2a$10$8K1p/a1Zy1b1Zy1b1Zy1bOKqzQzFX/.N1seUOQY1QQ1QWQgE8cMdG
INSERT INTO users (name, email, password) VALUES 
('Administrador Ford', 'admin@ford.com', '$2a$10$8K1p/a1Zy1b1Zy1b1Zy1bOKqzQzFX/.N1seUOQY1QQ1QWQgE8cMdG')
ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password);
