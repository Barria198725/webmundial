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

CREATE TABLE IF NOT EXISTS catalog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed básico de ejemplo
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
