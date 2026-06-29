import { pool } from "../database/mysqlConnection";
import { Match } from "../../domain/entities/Match";
import { Player } from "../../domain/entities/Player";
import { WorldRepository, GroupStanding } from "../../domain/repositories/worldRepository";

export class MySQLWorldRepository implements WorldRepository {
  async getMatches(): Promise<Match[]> {
    const [rows] = await pool.query(
      `SELECT m.id, m.date, m.stage, ht.name as homeTeam, at.name as awayTeam, m.home_score as homeScore, m.away_score as awayScore, m.status, m.venue
       FROM matches m
       LEFT JOIN teams ht ON m.home_team_id = ht.id
       LEFT JOIN teams at ON m.away_team_id = at.id
       ORDER BY m.date ASC`
    );
    return (rows as any[]).map((row) => ({
      id: row.id,
      date: row.date.toISOString(),
      stage: row.stage,
      homeTeam: row.homeTeam,
      awayTeam: row.awayTeam,
      homeScore: row.homeScore,
      awayScore: row.awayScore,
      status: row.status,
      venue: row.venue,
    }));
  }

  async getGroups(): Promise<GroupStanding[]> {
    const [rows] = await pool.query(
      `SELECT s.group_name as groupName, t.name as team, s.played, s.points, s.goal_diff as goalDiff
       FROM standings s
       JOIN teams t ON s.team_id = t.id
       ORDER BY s.group_name, s.points DESC`
    );
    const groups: Record<string, GroupStanding> = {};
    (rows as any[]).forEach((row) => {
      if (!groups[row.groupName]) {
        groups[row.groupName] = { group: row.groupName, teams: [] };
      }
      groups[row.groupName].teams.push({
        name: row.team,
        played: row.played,
        points: row.points,
        goalDiff: row.goalDiff,
      });
    });
    return Object.values(groups);
  }

  async getScorers(): Promise<Player[]> {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, t.name as team, p.goals
       FROM players p
       LEFT JOIN teams t ON p.team_id = t.id
       ORDER BY p.goals DESC
       LIMIT 10`
    );
    return (rows as any[]).map((row) => ({
      id: row.id,
      name: row.name,
      team: row.team,
      goals: row.goals,
    }));
  }
}
