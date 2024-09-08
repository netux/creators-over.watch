interface StatFile<D> {
  lastUpdatedDate: string;
  data: D;
}
declare module "$assets/PatchNotes_Stats.jsonc" {
  export interface Counts {
    general: number;
    gamemode: number;
    hero: number;
    workshop: number;
  }

  export interface PatchNoteStat {
    addedBy: string;
    date: string;
    highlights: string[];
    workshopHighlights: string[]
    updates: Counts
    bugFixes: Counts
  }

  const stats: StatFile<PatchNoteStat[]>;
  export default stats;
}

declare module "$assets/BlizzardEmployees_Stats.jsonc" {
  export interface BlizzardEmployeeStat {
    date: string;
    action: string;
    employee: string;
    workedOnWorkshop: boolean;
    source: string;
  }

  const stats: StatFile<BlizzardEmployeeStat[]>;
  export default stats;
}

export {};
