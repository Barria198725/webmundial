CREATE DATABASE IF NOT EXISTS catalogdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE catalogdb;

CREATE TABLE IF NOT EXISTS catalog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO catalog (name, description, price) VALUES
  ('Auriculares Inalámbricos', 'Sonido estéreo con cancelación de ruido', 79.99),
  ('Teclado Mecánico', 'Teclado retroiluminado con switches rojo', 59.90),
  ('Monitor 24 pulgadas', 'Pantalla Full HD con altavoces integrados', 129.50)
ON DUPLICATE KEY UPDATE name = VALUES(name);
