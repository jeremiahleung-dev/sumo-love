export interface SumoApiRikishi {
  id: number;
  sumoDbId: number | null;
  nskId: number | null;
  shikonaEn: string;
  shikonaJp: string | null;
  currentRank: string | null;
  heya: string | null;
  birthDate: string | null;
  shusshin: string | null;
  height: number | null;
  weight: number | null;
  debut: string | null;
}

export interface SumoApiBasho {
  bashoId: string;
  date: string;
}

export interface SumoApiBanzukeEntry {
  side: "East" | "West";
  rank: string;
  rikishiID: number;
  shikonaEn: string;
  shikonaJp: string | null;
  wins: number;
  losses: number;
  absences: number;
  special_prizes: string[];
}

export interface SumoApiTorikumiEntry {
  bashoId: string;
  day: number;
  matchNo: number;
  eastId: number;
  eastShikona: string;
  westId: number;
  westShikona: string;
  kimarite: string | null;
  winnerId: number | null;
  winnerEn: string | null;
}

export interface SumoApiRikishiStats {
  basho: number;
  wins: number;
  losses: number;
  absences: number;
  yusho: number;
  specialPrizes: number;
}
