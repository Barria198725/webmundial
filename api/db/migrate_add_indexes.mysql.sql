-- MySQL migration: add indexes for common lookup columns if they do not exist
SET @sql = IF((SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'players' AND index_name = 'idx_players_team_id') = 0,
  'CREATE INDEX idx_players_team_id ON players(team_id)',
  'SELECT "idx exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = IF((SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'matches' AND index_name = 'idx_matches_home') = 0,
  'CREATE INDEX idx_matches_home ON matches(home_team_id)',
  'SELECT "idx exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = IF((SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'matches' AND index_name = 'idx_matches_away') = 0,
  'CREATE INDEX idx_matches_away ON matches(away_team_id)',
  'SELECT "idx exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = IF((SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'standings' AND index_name = 'idx_standings_team_id') = 0,
  'CREATE INDEX idx_standings_team_id ON standings(team_id)',
  'SELECT "idx exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = IF((SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'predictions' AND index_name = 'idx_predictions_user_id') = 0,
  'CREATE INDEX idx_predictions_user_id ON predictions(user_id)',
  'SELECT "idx exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = IF((SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'predictions' AND index_name = 'idx_predictions_match_id') = 0,
  'CREATE INDEX idx_predictions_match_id ON predictions(match_id)',
  'SELECT "idx exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT 'migration finished' AS status;
