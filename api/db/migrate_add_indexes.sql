-- Migration: add indexes and ensure nullable team_id
ALTER TABLE players MODIFY COLUMN team_id INT NULL;

-- players index
SET @db='mundialdb';
SET @tbl='players';
SET @idx='idx_players_team_id';
SELECT COUNT(*) INTO @cnt FROM information_schema.STATISTICS WHERE table_schema=@db AND table_name=@tbl AND index_name=@idx;
SET @sql = IF(@cnt=0, CONCAT('ALTER TABLE ', @tbl, ' ADD INDEX ', @idx, ' (team_id);'), 'SELECT "idx exists";');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- matches indexes
SET @tbl='matches';
SET @idx='idx_matches_home';
SELECT COUNT(*) INTO @cnt FROM information_schema.STATISTICS WHERE table_schema=@db AND table_name=@tbl AND index_name=@idx;
SET @sql = IF(@cnt=0, CONCAT('ALTER TABLE ', @tbl, ' ADD INDEX ', @idx, ' (home_team_id);'), 'SELECT "idx exists";');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx='idx_matches_away';
SELECT COUNT(*) INTO @cnt FROM information_schema.STATISTICS WHERE table_schema=@db AND table_name=@tbl AND index_name=@idx;
SET @sql = IF(@cnt=0, CONCAT('ALTER TABLE ', @tbl, ' ADD INDEX ', @idx, ' (away_team_id);'), 'SELECT "idx exists";');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- standings index
SET @tbl='standings';
SET @idx='idx_standings_team_id';
SELECT COUNT(*) INTO @cnt FROM information_schema.STATISTICS WHERE table_schema=@db AND table_name=@tbl AND index_name=@idx;
SET @sql = IF(@cnt=0, CONCAT('ALTER TABLE ', @tbl, ' ADD INDEX ', @idx, ' (team_id);'), 'SELECT "idx exists";');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- predictions indexes
SET @tbl='predictions';
SET @idx='idx_predictions_user_id';
SELECT COUNT(*) INTO @cnt FROM information_schema.STATISTICS WHERE table_schema=@db AND table_name=@tbl AND index_name=@idx;
SET @sql = IF(@cnt=0, CONCAT('ALTER TABLE ', @tbl, ' ADD INDEX ', @idx, ' (user_id);'), 'SELECT "idx exists";');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx='idx_predictions_match_id';
SELECT COUNT(*) INTO @cnt FROM information_schema.STATISTICS WHERE table_schema=@db AND table_name=@tbl AND index_name=@idx;
SET @sql = IF(@cnt=0, CONCAT('ALTER TABLE ', @tbl, ' ADD INDEX ', @idx, ' (match_id);'), 'SELECT "idx exists";');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- finished
SELECT 'migration finished' as status;
