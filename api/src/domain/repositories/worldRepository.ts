import { Match } from "../entities/Match";
import { Player } from "../entities/Player";

export interface GroupStanding {
  group: string;
  teams: Array<{ name: string; played: number; points: number; goalDiff: number }>;
}

export interface WorldRepository {
  getMatches(): Promise<Match[]>;
  getGroups(): Promise<GroupStanding[]>;
  getScorers(): Promise<Player[]>;
}
