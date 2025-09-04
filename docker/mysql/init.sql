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

-- Inserir usuários de teste com senhas BCrypt válidas
-- admin123 = $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- user123 = $2a$10$DowJonesLksdjfLKSJFlksjdflkJsldkjflsdkjflsdkjfSlkdjf
INSERT INTO users (name, email, password) VALUES 
('Administrador Ford', 'admin@ford.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Usuário Ford', 'user@ford.com', '$2a$10$DowJonesLksdjfLKSJFlksjdflkJsldkjflsdkjflsdkjfSlkdjf')
ON DUPLICATE KEY UPDATE name = VALUES(name);
