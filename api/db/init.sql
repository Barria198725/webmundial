CREATE DATABASE IF NOT EXISTS mundialdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mundialdb;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  points INT NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  country VARCHAR(200),
  flag_url VARCHAR(512),
  stadiums INT DEFAULT 0,
  cities INT DEFAULT 0,
  matches INT DEFAULT 0,
  UNIQUE KEY uk_teams_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS host_countries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  code VARCHAR(8),
  flag_url VARCHAR(512),
  UNIQUE KEY uk_host_countries_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  team_id INT NULL,
  goals INT DEFAULT 0,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
  INDEX idx_players_team_id (team_id),
  UNIQUE KEY uk_players_team (name, team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `date` DATETIME NOT NULL,
  stage VARCHAR(100),
  home_team_id INT,
  away_team_id INT,
  home_score INT NULL,
  away_score INT NULL,
  status ENUM('upcoming','live','finished') DEFAULT 'upcoming',
  venue VARCHAR(255),
  FOREIGN KEY (home_team_id) REFERENCES teams(id) ON DELETE SET NULL,
  FOREIGN KEY (away_team_id) REFERENCES teams(id) ON DELETE SET NULL,
  INDEX idx_matches_home (home_team_id),
  INDEX idx_matches_away (away_team_id),
  UNIQUE KEY uk_matches_unique (date, home_team_id, away_team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS standings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  group_name VARCHAR(8),
  played INT DEFAULT 0,
  won INT DEFAULT 0,
  draw INT DEFAULT 0,
  lost INT DEFAULT 0,
  points INT DEFAULT 0,
  goal_diff INT DEFAULT 0,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  INDEX idx_standings_team_id (team_id),
  UNIQUE KEY uk_standings_team (team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS predictions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  match_id INT NOT NULL,
  home_score INT NOT NULL,
  away_score INT NOT NULL,
  points_awarded INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  INDEX idx_predictions_user_id (user_id),
  INDEX idx_predictions_match_id (match_id),
  UNIQUE KEY uk_predictions_user_match (user_id, match_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS catalog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  category VARCHAR(100) DEFAULT 'General'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS legends (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  bio TEXT,
  image_url VARCHAR(512)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  content TEXT,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO teams (name, country, stadiums, cities, matches) VALUES
  ("USA", "United States", 10, 11, 60),
  ("Mexico", "Mexico", 3, 3, 10),
  ("Canada", "Canada", 3, 3, 10)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO host_countries (name, code) VALUES
  ('United States', 'USA'),
  ('Mexico', 'MEX'),
  ('Canada', 'CAN')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO users (name, email, points) VALUES
  ('Irving', 'irving@example.com', 145),
  ('Carlos', 'carlos@example.com', 130),
  ('Ana', 'ana@example.com', 122)
ON DUPLICATE KEY UPDATE email = VALUES(email);

INSERT INTO catalog (name, description, price) VALUES
  ('Balón oficial', 'Balón con diseño del Mundial 2026.', 59.99),
  ('Camiseta oficial', 'Camiseta edición limitada del torneo.', 89.90),
  ('Gorra de fan', 'Gorra con colores del país anfitrión.', 19.50)
ON DUPLICATE KEY UPDATE description = VALUES(description), price = VALUES(price);

INSERT INTO legends (name, bio) VALUES
  ('Pelé', 'Considerado uno de los mejores de la historia.'),
  ('Maradona', 'Ícono argentino con talento incomparable.'),
  ('Messi', 'Figura contemporánea con múltiples títulos.')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO players (name, team_id, goals) VALUES
  ('Christian Pulisic', 1, 3),
  ('Hirving Lozano', 2, 2),
  ('Alphonso Davies', 3, 1)
ON DUPLICATE KEY UPDATE goals = VALUES(goals);

INSERT INTO standings (team_id, group_name, played, won, draw, lost, points, goal_diff) VALUES
  (1, 'A', 2, 2, 0, 0, 6, 4),
  (2, 'A', 2, 1, 0, 1, 3, 0),
  (3, 'A', 2, 0, 0, 2, 0, -4)
ON DUPLICATE KEY UPDATE played = VALUES(played), won = VALUES(won), draw = VALUES(draw), lost = VALUES(lost), points = VALUES(points), goal_diff = VALUES(goal_diff);

INSERT INTO catalog (name, description, price, category) VALUES
  ('Playera oficial', 'Playera oficial del Mundial 2026', 29.99, 'Merchandising'),
  ('Balón de edición limitada', 'Balón oficial con diseño especial del torneo', 49.99, 'Equipamiento'),
  ('Entrada VIP', 'Pase VIP para ver el partido desde la zona premium', 199.99, 'Entradas')
ON DUPLICATE KEY UPDATE description = VALUES(description), price = VALUES(price), category = VALUES(category);

INSERT INTO news (title, content) VALUES
  ('Lanzamiento Mundo Fútbol 2026', 'Bienvenido a la plataforma independiente del Mundial 2026.'),
  ('Actualización de calendarios', 'Se han cargado los primeros partidos de la fase de grupos.')
ON DUPLICATE KEY UPDATE content = VALUES(content);

INSERT INTO catalog (name, description, price) VALUES
  ('Balon oficial', 'Balon con diseno inspirado en la Copa Mundial 2026.', 89.99),
  ('Camiseta oficial', 'Camiseta edicion 2026 para coleccionistas y aficionados.', 59.99),
  ('Pase premium', 'Acceso a funciones especiales de seguimiento y prediccion.', 19.99)
ON DUPLICATE KEY UPDATE description = VALUES(description), price = VALUES(price);

-- Partidos de ejemplo y equipos referenciados
INSERT INTO matches (`date`, stage, home_team_id, away_team_id, venue, status) VALUES
  ('2026-06-11 18:00:00', 'Grupo A', 1, 2, 'Estadio Azteca', 'upcoming'),
  ('2026-06-12 21:00:00', 'Grupo B', 3, 1, 'BC Place', 'upcoming')
ON DUPLICATE KEY UPDATE home_score = VALUES(home_score), away_score = VALUES(away_score), status = VALUES(status), venue = VALUES(venue);
INSERT INTO teams (name) VALUES
  ('Alemania'),
  ('Arabia Saudí'),
  ('Argelia'),
  ('Argentina'),
  ('Australia'),
  ('Austria'),
  ('Bosnia y Herzegovina'),
  ('Brasil'),
  ('Bélgica'),
  ('Cabo Verde'),
  ('Canadá'),
  ('Catar'),
  ('Chequia'),
  ('Colombia'),
  ('Costa de Marfil'),
  ('Croacia'),
  ('Curazao'),
  ('Ecuador'),
  ('Egipto'),
  ('Escocia'),
  ('España'),
  ('Estados Unidos'),
  ('Francia'),
  ('Ganador Partido 101'),
  ('Ganador Partido 102'),
  ('Ghana'),
  ('Haití'),
  ('Inglaterra'),
  ('Irak'),
  ('Japón'),
  ('Jordania'),
  ('Marruecos'),
  ('México'),
  ('Noruega'),
  ('Nueva Zelanda'),
  ('Panamá'),
  ('Paraguay'),
  ('Países Bajos'),
  ('Perdedor Partido 101'),
  ('Perdedor Partido 102'),
  ('Portugal'),
  ('RD Congo'),
  ('RI de Irán'),
  ('República de Corea'),
  ('Senegal'),
  ('Sudáfrica'),
  ('Suecia'),
  ('Suiza'),
  ('Turquía'),
  ('Túnez'),
  ('Uruguay'),
  ('Uzbekistán')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO matches (`date`, stage, home_team_id, away_team_id, home_score, away_score, status, venue) VALUES
  ('2026-06-11 18:00:00', 'Grupo A', (SELECT id FROM teams WHERE name = 'México'), (SELECT id FROM teams WHERE name = 'Sudáfrica'), 2, 0, 'finished', 'Estadio Ciudad de México'),
  ('2026-06-12 18:00:00', 'Grupo B', (SELECT id FROM teams WHERE name = 'Canadá'), (SELECT id FROM teams WHERE name = 'Bosnia y Herzegovina'), 1, 1, 'finished', 'Estadio Toronto'),
  ('2026-06-12 18:00:00', 'Grupo D', (SELECT id FROM teams WHERE name = 'Estados Unidos'), (SELECT id FROM teams WHERE name = 'Paraguay'), 4, 1, 'finished', 'Estadio Los Ángeles'),
  ('2026-06-13 18:00:00', 'Grupo B', (SELECT id FROM teams WHERE name = 'Catar'), (SELECT id FROM teams WHERE name = 'Suiza'), 1, 1, 'finished', 'Estadio Bahía de San Francisco'),
  ('2026-06-13 18:00:00', 'Grupo C', (SELECT id FROM teams WHERE name = 'Brasil'), (SELECT id FROM teams WHERE name = 'Marruecos'), 1, 1, 'finished', 'Estadio Nueva York Nueva Jersey'),
  ('2026-06-13 18:00:00', 'Grupo C', (SELECT id FROM teams WHERE name = 'Haití'), (SELECT id FROM teams WHERE name = 'Escocia'), 0, 1, 'finished', 'Estadio Boston'),
  ('2026-06-13 18:00:00', 'Grupo D', (SELECT id FROM teams WHERE name = 'Australia'), (SELECT id FROM teams WHERE name = 'Turquía'), 2, 0, 'finished', 'Estadio BC Place Vancouver'),
  ('2026-06-14 18:00:00', 'Grupo E', (SELECT id FROM teams WHERE name = 'Alemania'), (SELECT id FROM teams WHERE name = 'Curazao'), 7, 1, 'finished', 'Estadio Houston'),
  ('2026-06-14 18:00:00', 'Grupo F', (SELECT id FROM teams WHERE name = 'Países Bajos'), (SELECT id FROM teams WHERE name = 'Japón'), 2, 2, 'finished', 'Estadio Dallas'),
  ('2026-06-14 18:00:00', 'Grupo E', (SELECT id FROM teams WHERE name = 'Costa de Marfil'), (SELECT id FROM teams WHERE name = 'Ecuador'), 1, 0, 'finished', 'Estadio Filadelfia'),
  ('2026-06-14 18:00:00', 'Grupo F', (SELECT id FROM teams WHERE name = 'Suecia'), (SELECT id FROM teams WHERE name = 'Túnez'), 5, 1, 'finished', 'Estadio Monterrey'),
  ('2026-06-15 18:00:00', 'Grupo H', (SELECT id FROM teams WHERE name = 'España'), (SELECT id FROM teams WHERE name = 'Cabo Verde'), 0, 0, 'finished', 'Estadio Atlanta'),
  ('2026-06-15 18:00:00', 'Grupo G', (SELECT id FROM teams WHERE name = 'Bélgica'), (SELECT id FROM teams WHERE name = 'Egipto'), 1, 1, 'finished', 'Estadio Seattle'),
  ('2026-06-15 18:00:00', 'Grupo H', (SELECT id FROM teams WHERE name = 'Arabia Saudí'), (SELECT id FROM teams WHERE name = 'Uruguay'), 1, 1, 'finished', 'Estadio Miami'),
  ('2026-06-15 18:00:00', 'Grupo G', (SELECT id FROM teams WHERE name = 'RI de Irán'), (SELECT id FROM teams WHERE name = 'Nueva Zelanda'), 2, 2, 'finished', 'Estadio Los Ángeles'),
  ('2026-06-16 18:00:00', 'Grupo I', (SELECT id FROM teams WHERE name = 'Francia'), (SELECT id FROM teams WHERE name = 'Senegal'), 3, 1, 'finished', 'Estadio Nueva York Nueva Jersey'),
  ('2026-06-16 18:00:00', 'Grupo I', (SELECT id FROM teams WHERE name = 'Irak'), (SELECT id FROM teams WHERE name = 'Noruega'), 1, 4, 'finished', 'Estadio Boston'),
  ('2026-06-16 18:00:00', 'Grupo J', (SELECT id FROM teams WHERE name = 'Argentina'), (SELECT id FROM teams WHERE name = 'Argelia'), 3, 0, 'finished', 'Estadio Kansas City'),
  ('2026-06-16 18:00:00', 'Grupo J', (SELECT id FROM teams WHERE name = 'Austria'), (SELECT id FROM teams WHERE name = 'Jordania'), 3, 1, 'finished', 'Estadio Bahía de San Francisco'),
  ('2026-06-17 18:00:00', 'Grupo K', (SELECT id FROM teams WHERE name = 'Portugal'), (SELECT id FROM teams WHERE name = 'RD Congo'), 0, 0, 'finished', 'Estadio Houston'),
  ('2026-06-17 18:00:00', 'Grupo L', (SELECT id FROM teams WHERE name = 'Inglaterra'), (SELECT id FROM teams WHERE name = 'Croacia'), 4, 2, 'finished', 'Estadio Dallas'),
  ('2026-06-17 18:00:00', 'Grupo L', (SELECT id FROM teams WHERE name = 'Ghana'), (SELECT id FROM teams WHERE name = 'Panamá'), 1, 0, 'finished', 'Estadio Toronto'),
  ('2026-06-17 18:00:00', 'Grupo K', (SELECT id FROM teams WHERE name = 'Uzbekistán'), (SELECT id FROM teams WHERE name = 'Colombia'), 1, 3, 'finished', 'Estadio Ciudad de México'),
  ('2026-06-18 18:00:00', 'Grupo A', (SELECT id FROM teams WHERE name = 'Chequia'), (SELECT id FROM teams WHERE name = 'Sudáfrica'), 1, 1, 'finished', 'Estadio Atlanta'),
  ('2026-06-18 18:00:00', 'Grupo B', (SELECT id FROM teams WHERE name = 'Suiza'), (SELECT id FROM teams WHERE name = 'Bosnia y Herzegovina'), 4, 1, 'finished', 'Estadio Los Ángeles'),
  ('2026-06-18 18:00:00', 'Grupo A', (SELECT id FROM teams WHERE name = 'México'), (SELECT id FROM teams WHERE name = 'República de Corea'), 1, 0, 'finished', 'Estadio Guadalajara'),
  ('2026-06-19 18:00:00', 'Grupo D', (SELECT id FROM teams WHERE name = 'Estados Unidos'), (SELECT id FROM teams WHERE name = 'Australia'), 2, 0, 'finished', 'Estadio Seattle'),
  ('2026-06-19 18:00:00', 'Grupo C', (SELECT id FROM teams WHERE name = 'Escocia'), (SELECT id FROM teams WHERE name = 'Marruecos'), 0, 1, 'finished', 'Estadio Boston'),
  ('2026-06-19 18:00:00', 'Grupo C', (SELECT id FROM teams WHERE name = 'Brasil'), (SELECT id FROM teams WHERE name = 'Haití'), 3, 0, 'finished', 'Estadio Filadelfia'),
  ('2026-06-19 18:00:00', 'Grupo D', (SELECT id FROM teams WHERE name = 'Turquía'), (SELECT id FROM teams WHERE name = 'Paraguay'), 0, 1, 'finished', 'Estadio Bahía de San Francisco'),
  ('2026-06-20 18:00:00', 'Grupo F', (SELECT id FROM teams WHERE name = 'Países Bajos'), (SELECT id FROM teams WHERE name = 'Suecia'), 5, 1, 'finished', 'Estadio Houston'),
  ('2026-06-20 18:00:00', 'Grupo E', (SELECT id FROM teams WHERE name = 'Alemania'), (SELECT id FROM teams WHERE name = 'Costa de Marfil'), 2, 1, 'finished', 'Estadio Toronto'),
  ('2026-06-20 18:00:00', 'Grupo E', (SELECT id FROM teams WHERE name = 'Ecuador'), (SELECT id FROM teams WHERE name = 'Curazao'), 0, 0, 'finished', 'Estadio Kansas City'),
  ('2026-06-20 18:00:00', 'Grupo F', (SELECT id FROM teams WHERE name = 'Túnez'), (SELECT id FROM teams WHERE name = 'Japón'), 0, 4, 'finished', 'Estadio Monterrey'),
  ('2026-06-21 18:00:00', 'Grupo H', (SELECT id FROM teams WHERE name = 'España'), (SELECT id FROM teams WHERE name = 'Arabia Saudí'), 4, 0, 'finished', 'Estadio Atlanta'),
  ('2026-06-21 18:00:00', 'Grupo G', (SELECT id FROM teams WHERE name = 'Bélgica'), (SELECT id FROM teams WHERE name = 'RI de Irán'), 0, 0, 'finished', 'Estadio Los Ángeles'),
  ('2026-06-21 18:00:00', 'Grupo H', (SELECT id FROM teams WHERE name = 'Uruguay'), (SELECT id FROM teams WHERE name = 'Cabo Verde'), 2, 2, 'finished', 'Estadio Miami'),
  ('2026-06-21 18:00:00', 'Grupo G', (SELECT id FROM teams WHERE name = 'Nueva Zelanda'), (SELECT id FROM teams WHERE name = 'Egipto'), 1, 3, 'finished', 'Estadio BC Place Vancouver'),
  ('2026-06-22 18:00:00', 'Grupo J', (SELECT id FROM teams WHERE name = 'Argentina'), (SELECT id FROM teams WHERE name = 'Austria'), 2, 0, 'finished', 'Estadio Dallas'),
  ('2026-06-22 18:00:00', 'Grupo I', (SELECT id FROM teams WHERE name = 'Francia'), (SELECT id FROM teams WHERE name = 'Irak'), 3, 0, 'finished', 'Estadio Filadelfia'),
  ('2026-06-22 18:00:00', 'Grupo I', (SELECT id FROM teams WHERE name = 'Noruega'), (SELECT id FROM teams WHERE name = 'Senegal'), 3, 2, 'finished', 'Estadio Nueva York Nueva Jersey'),
  ('2026-06-22 18:00:00', 'Grupo J', (SELECT id FROM teams WHERE name = 'Jordania'), (SELECT id FROM teams WHERE name = 'Argelia'), 1, 2, 'finished', 'Estadio Bahía de San Francisco Bay'),
  ('2026-06-23 18:00:00', 'Grupo K', (SELECT id FROM teams WHERE name = 'Portugal'), (SELECT id FROM teams WHERE name = 'Uzbekistán'), 5, 0, 'finished', 'Estadio Houston'),
  ('2026-06-23 18:00:00', 'Grupo L', (SELECT id FROM teams WHERE name = 'Inglaterra'), (SELECT id FROM teams WHERE name = 'Ghana'), 0, 0, 'finished', 'Estadio Boston'),
  ('2026-06-23 18:00:00', 'Grupo L', (SELECT id FROM teams WHERE name = 'Panamá'), (SELECT id FROM teams WHERE name = 'Croacia'), 0, 1, 'finished', 'Estadio Toronto'),
  ('2026-06-23 18:00:00', 'Grupo K', (SELECT id FROM teams WHERE name = 'Colombia'), (SELECT id FROM teams WHERE name = 'RD Congo'), 1, 0, 'finished', 'Estadio Guadalajara'),
  ('2026-06-24 18:00:00', 'Grupo B', (SELECT id FROM teams WHERE name = 'Suiza'), (SELECT id FROM teams WHERE name = 'Canadá'), 2, 1, 'finished', 'Estadio BC Place Vancouver'),
  ('2026-06-24 18:00:00', 'Grupo B', (SELECT id FROM teams WHERE name = 'Bosnia y Herzegovina'), (SELECT id FROM teams WHERE name = 'Catar'), 3, 1, 'finished', 'Estadio Seattle'),
  ('2026-06-24 18:00:00', 'Grupo C', (SELECT id FROM teams WHERE name = 'Escocia'), (SELECT id FROM teams WHERE name = 'Brasil'), 0, 3, 'finished', 'Estadio Miami'),
  ('2026-06-24 18:00:00', 'Grupo C', (SELECT id FROM teams WHERE name = 'Marruecos'), (SELECT id FROM teams WHERE name = 'Haití'), 4, 2, 'finished', 'Estadio Atlanta'),
  ('2026-06-24 18:00:00', 'Grupo A', (SELECT id FROM teams WHERE name = 'Chequia'), (SELECT id FROM teams WHERE name = 'México'), 0, 3, 'finished', 'Estadio Ciudad de México'),
  ('2026-06-24 18:00:00', 'Grupo A', (SELECT id FROM teams WHERE name = 'Sudáfrica'), (SELECT id FROM teams WHERE name = 'República de Corea'), 1, 0, 'finished', 'Estadio Monterrey'),
  ('2026-06-25 18:00:00', 'Grupo E', (SELECT id FROM teams WHERE name = 'Curazao'), (SELECT id FROM teams WHERE name = 'Costa de Marfil'), 0, 2, 'finished', 'Estadio Filadelfia'),
  ('2026-06-25 18:00:00', 'Grupo E', (SELECT id FROM teams WHERE name = 'Ecuador'), (SELECT id FROM teams WHERE name = 'Alemania'), 2, 1, 'finished', 'Estadio Nueva York Nueva Jersey'),
  ('2026-06-25 18:00:00', 'Grupo F', (SELECT id FROM teams WHERE name = 'Japón'), (SELECT id FROM teams WHERE name = 'Suecia'), 1, 1, 'finished', 'Estadio Dallas'),
  ('2026-06-25 18:00:00', 'Grupo F', (SELECT id FROM teams WHERE name = 'Túnez'), (SELECT id FROM teams WHERE name = 'Países Bajos'), 1, 3, 'finished', 'Estadio Kansas City'),
  ('2026-06-25 18:00:00', 'Grupo D', (SELECT id FROM teams WHERE name = 'Turquía'), (SELECT id FROM teams WHERE name = 'Estados Unidos'), 3, 2, 'finished', 'Estadio Los Ángeles'),
  ('2026-06-25 18:00:00', 'Grupo D', (SELECT id FROM teams WHERE name = 'Paraguay'), (SELECT id FROM teams WHERE name = 'Australia'), 0, 0, 'finished', 'Estadio Bahía de San Francisco'),
  ('2026-06-26 18:00:00', 'Grupo I', (SELECT id FROM teams WHERE name = 'Noruega'), (SELECT id FROM teams WHERE name = 'Francia'), 1, 4, 'finished', 'Estadio Boston'),
  ('2026-06-26 18:00:00', 'Grupo I', (SELECT id FROM teams WHERE name = 'Senegal'), (SELECT id FROM teams WHERE name = 'Irak'), 5, 0, 'finished', 'Estadio Toronto'),
  ('2026-06-26 18:00:00', 'Grupo H', (SELECT id FROM teams WHERE name = 'Cabo Verde'), (SELECT id FROM teams WHERE name = 'Arabia Saudí'), 0, 0, 'finished', 'Estadio Houston'),
  ('2026-06-26 18:00:00', 'Grupo H', (SELECT id FROM teams WHERE name = 'Uruguay'), (SELECT id FROM teams WHERE name = 'España'), 0, 1, 'finished', 'Estadio Guadalajara'),
  ('2026-06-26 18:00:00', 'Grupo G', (SELECT id FROM teams WHERE name = 'Egipto'), (SELECT id FROM teams WHERE name = 'RI de Irán'), 1, 1, 'finished', 'Estadio Seattle'),
  ('2026-06-26 18:00:00', 'Grupo G', (SELECT id FROM teams WHERE name = 'Nueva Zelanda'), (SELECT id FROM teams WHERE name = 'Bélgica'), 1, 5, 'finished', 'Estadio BC Place Vancouver'),
  ('2026-06-27 18:00:00', 'Grupo L', (SELECT id FROM teams WHERE name = 'Panamá'), (SELECT id FROM teams WHERE name = 'Inglaterra'), 0, 2, 'finished', 'Estadio Nueva York Nueva Jersey'),
  ('2026-06-27 18:00:00', 'Grupo L', (SELECT id FROM teams WHERE name = 'Croacia'), (SELECT id FROM teams WHERE name = 'Ghana'), 2, 1, 'finished', 'Estadio Filadelfia'),
  ('2026-06-27 18:00:00', 'Grupo K', (SELECT id FROM teams WHERE name = 'Colombia'), (SELECT id FROM teams WHERE name = 'Portugal'), 0, 0, 'finished', 'Estadio Miami'),
  ('2026-06-27 18:00:00', 'Grupo K', (SELECT id FROM teams WHERE name = 'RD Congo'), (SELECT id FROM teams WHERE name = 'Uzbekistán'), 3, 1, 'finished', 'Estadio Atlanta'),
  ('2026-06-27 18:00:00', 'Grupo J', (SELECT id FROM teams WHERE name = 'Argelia'), (SELECT id FROM teams WHERE name = 'Austria'), 3, 3, 'finished', 'Estadio Kansas City'),
  ('2026-06-27 18:00:00', 'Grupo J', (SELECT id FROM teams WHERE name = 'Jordania'), (SELECT id FROM teams WHERE name = 'Argentina'), 1, 3, 'finished', 'Estadio Dallas'),
  ('2026-06-28 18:00:00', 'Copa Mundial de la FIFA 2026™ – Dieciseisavos de final', (SELECT id FROM teams WHERE name = 'Sudáfrica'), (SELECT id FROM teams WHERE name = 'Canadá'), 0, 1, 'finished', 'Estadio Los Ángeles'),
  ('2026-06-29 18:00:00', 'Copa Mundial de la FIFA 2026™ – Dieciseisavos de final', (SELECT id FROM teams WHERE name = 'Alemania'), (SELECT id FROM teams WHERE name = 'Paraguay'), 1, 1, 'finished', 'Estadio Boston'),
  ('2026-06-29 18:00:00', 'Copa Mundial de la FIFA 2026™ – Dieciseisavos de final', (SELECT id FROM teams WHERE name = 'Países Bajos'), (SELECT id FROM teams WHERE name = 'Marruecos'), 1, 1, 'finished', 'Estadio Monterrey'),
  ('2026-06-29 18:00:00', 'Copa Mundial de la FIFA 2026™ – Dieciseisavos de final', (SELECT id FROM teams WHERE name = 'Brasil'), (SELECT id FROM teams WHERE name = 'Japón'), 2, 1, 'finished', 'Estadio Houston'),
  ('2026-06-30 17:00:00', 'Copa Mundial de la FIFA 2026™ – Dieciseisavos de final', (SELECT id FROM teams WHERE name = 'Francia'), (SELECT id FROM teams WHERE name = 'Suecia'), 3, 0, 'finished', 'Estadio Nueva York Nueva Jersey'),
  ('2026-06-30 13:00:00', 'Copa Mundial de la FIFA 2026™ – Dieciseisavos de final', (SELECT id FROM teams WHERE name = 'Costa de Marfil'), (SELECT id FROM teams WHERE name = 'Noruega'), 1, 2, 'finished', 'Estadio Dallas'),
  ('2026-06-30 21:00:00', 'Copa Mundial de la FIFA 2026™ – Dieciseisavos de final', (SELECT id FROM teams WHERE name = 'México'), (SELECT id FROM teams WHERE name = 'Ecuador'), 2, 0, 'finished', 'Estadio Ciudad de México'),
  ('2026-07-01 12:00:00', 'Copa Mundial de la FIFA 2026™ – Dieciseisavos de final', (SELECT id FROM teams WHERE name = 'Inglaterra'), (SELECT id FROM teams WHERE name = 'RD Congo'), 2, 1, 'finished', 'Estadio Atlanta'),
  ('2026-07-01 20:00:00', 'Copa Mundial de la FIFA 2026™ – Dieciseisavos de final', (SELECT id FROM teams WHERE name = 'Estados Unidos'), (SELECT id FROM teams WHERE name = 'Bosnia y Herzegovina'), 2, 0, 'finished', 'Estadio Bahía de San Francisco'),
  ('2026-07-01 16:00:00', 'Copa Mundial de la FIFA 2026™ – Dieciseisavos de final', (SELECT id FROM teams WHERE name = 'Bélgica'), (SELECT id FROM teams WHERE name = 'Senegal'), 3, 2, 'finished', 'Estadio Seattle'),
  ('2026-07-02 19:00:00', 'Copa Mundial de la FIFA 2026™ – Dieciseisavos de final', (SELECT id FROM teams WHERE name = 'Portugal'), (SELECT id FROM teams WHERE name = 'Croacia'), 2, 1, 'finished', 'Estadio Toronto'),
  ('2026-07-02 15:00:00', 'Copa Mundial de la FIFA 2026™ – Dieciseisavos de final', (SELECT id FROM teams WHERE name = 'España'), (SELECT id FROM teams WHERE name = 'Austria'), 3, 0, 'finished', 'Estadio Los Ángeles'),
  ('2026-07-02 23:00:00', 'Copa Mundial de la FIFA 2026™ – Dieciseisavos de final', (SELECT id FROM teams WHERE name = 'Suiza'), (SELECT id FROM teams WHERE name = 'Argelia'), 2, 0, 'finished', 'Estadio BC Place Vancouver'),
  ('2026-07-03 21:30:00', 'Copa Mundial de la FIFA 2026™ – Dieciseisavos de final', (SELECT id FROM teams WHERE name = 'Colombia'), (SELECT id FROM teams WHERE name = 'Ghana'), 1, 0, 'finished', 'Estadio Kansas City'),
  ('2026-07-03 14:00:00', 'Copa Mundial de la FIFA 2026™ – Dieciseisavos de final', (SELECT id FROM teams WHERE name = 'Australia'), (SELECT id FROM teams WHERE name = 'Egipto'), 1, 1, 'finished', 'Estadio Dallas'),
  ('2026-07-04 17:00:00', 'Copa Mundial de la FIFA', (SELECT id FROM teams WHERE name = 'Paraguay'), (SELECT id FROM teams WHERE name = 'Francia'), 0, 1, 'finished', 'Estadio Filadelfia'),
  ('2026-07-04 13:00:00', 'Copa Mundial de la FIFA', (SELECT id FROM teams WHERE name = 'Canadá'), (SELECT id FROM teams WHERE name = 'Marruecos'), 0, 3, 'finished', 'Estadio Houston'),
  ('2026-07-05 16:00:00', 'Copa Mundial de la FIFA', (SELECT id FROM teams WHERE name = 'Brasil'), (SELECT id FROM teams WHERE name = 'Noruega'), 1, 2, 'finished', 'Estadio Nueva York Nueva Jersey'),
  ('2026-07-05 20:00:00', 'Copa Mundial de la FIFA', (SELECT id FROM teams WHERE name = 'México'), (SELECT id FROM teams WHERE name = 'Inglaterra'), 2, 3, 'finished', 'Estadio Ciudad de México'),
  ('2026-07-06 15:00:00', 'Copa Mundial de la FIFA', (SELECT id FROM teams WHERE name = 'Portugal'), (SELECT id FROM teams WHERE name = 'España'), 0, 1, 'finished', 'Estadio Dallas'),
  ('2026-07-06 20:00:00', 'Copa Mundial de la FIFA', (SELECT id FROM teams WHERE name = 'Estados Unidos'), (SELECT id FROM teams WHERE name = 'Bélgica'), 1, 4, 'finished', 'Estadio Seattle'),
  ('2026-07-07 12:00:00', 'Copa Mundial de la FIFA', (SELECT id FROM teams WHERE name = 'Argentina'), (SELECT id FROM teams WHERE name = 'Egipto'), 3, 2, 'finished', 'Estadio Atlanta'),
  ('2026-07-07 16:00:00', 'Copa Mundial de la FIFA', (SELECT id FROM teams WHERE name = 'Suiza'), (SELECT id FROM teams WHERE name = 'Colombia'), 0, 0, 'finished', 'Estadio BC Place Vancouver'),
  ('2026-07-09 16:00:00', 'Copa Mundial de la FIFA', (SELECT id FROM teams WHERE name = 'Francia'), (SELECT id FROM teams WHERE name = 'Marruecos'), 2, 0, 'finished', 'Estadio Boston'),
  ('2026-07-10 15:00:00', 'Copa Mundial de la FIFA', (SELECT id FROM teams WHERE name = 'España'), (SELECT id FROM teams WHERE name = 'Bélgica'), NULL, NULL, 'upcoming', 'Estadio Los Ángeles'),
  ('2026-07-11 17:00:00', 'Copa Mundial de la FIFA', (SELECT id FROM teams WHERE name = 'Noruega'), (SELECT id FROM teams WHERE name = 'Inglaterra'), NULL, NULL, 'upcoming', 'Estadio Miami'),
  ('2026-07-11 21:00:00', 'Copa Mundial de la FIFA', (SELECT id FROM teams WHERE name = 'Argentina'), (SELECT id FROM teams WHERE name = 'Suiza'), NULL, NULL, 'upcoming', 'Estadio Kansas City'),
  ('2026-07-14 15:00:00', 'Copa Mundial de la FIFA', (SELECT id FROM teams WHERE name = 'Francia'), (SELECT id FROM teams WHERE name = ''), NULL, NULL, 'upcoming', 'Estadio Dallas'),
  ('2026-07-15 15:00:00', 'Copa Mundial de la FIFA', (SELECT id FROM teams WHERE name = ''), (SELECT id FROM teams WHERE name = ''), NULL, NULL, 'upcoming', 'Estadio Atlanta'),
  ('2026-07-18 17:00:00', 'Copa Mundial de la FIFA', (SELECT id FROM teams WHERE name = 'Perdedor Partido 101'), (SELECT id FROM teams WHERE name = 'Perdedor Partido 102'), NULL, NULL, 'upcoming', 'Estadio Miami'),
  ('2026-07-19 15:00:00', 'Copa Mundial de la FIFA', (SELECT id FROM teams WHERE name = 'Ganador Partido 101'), (SELECT id FROM teams WHERE name = 'Ganador Partido 102'), NULL, NULL, 'upcoming', 'Estadio Nueva York Nueva Jersey'),
  ('2026-06-11 18:00:00', 'Grupo A', (SELECT id FROM teams WHERE name = 'República de Corea'), (SELECT id FROM teams WHERE name = 'Chequia'), 2, 1, 'finished', 'Estadio Guadalajara'),
  ('2026-06-18 18:00:00', 'Grupo B', (SELECT id FROM teams WHERE name = 'Canadá'), (SELECT id FROM teams WHERE name = 'Catar'), 6, 0, 'finished', 'Estadio BC Place Vancouver'),
  ('2026-07-03 18:00:00', 'Copa Mundial de la FIFA 2026™ – Dieciseisavos de final', (SELECT id FROM teams WHERE name = 'Argentina'), (SELECT id FROM teams WHERE name = 'Cabo Verde'), 3, 2, 'finished', 'Estadio Miami')
ON DUPLICATE KEY UPDATE home_score = VALUES(home_score), away_score = VALUES(away_score), status = VALUES(status);