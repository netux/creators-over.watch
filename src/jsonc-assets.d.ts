declare module "./assets/PatchNotes_Stats.jsonc" {
  interface Counts {
    general: number;
    gamemode: number;
    hero: number;
    workshop: number;
  }

  interface Data {
    addedBy: string;
    date: string;
    highlights: string[];
    workshopHighlights: string[]
    updates: Counts
    bugFixes: Counts
  }

  interface StatFile<D> {
    lastUpdatedDate: string;
    data: D;
  }

  const stats: StatFile<Data[]>;
  export default stats;
}

declare module "./assets/BlizzardEmployees_Stats.jsonc" {
  interface Data {
    date: string;
    action: string;
    employee: string;
    workedOnWorkshop: boolean;
    source: string;
  }

  interface StatFile<D> {
    lastUpdatedDate: string;
    data: D;
  }


  const stats: StatFile<Data[]>;
  export default stats;
}

export {};
