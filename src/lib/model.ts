interface PatchNoteStatCounts {
	general: number;
	gamemode: number;
	hero: number;
	workshop: number;
}

export interface PatchNoteStat {
	highlights: string[];
	workshopHighlights: string[];
	updates: PatchNoteStatCounts;
	bugFixes: PatchNoteStatCounts;
}

export interface BlizzardEmployeeStat {
	action: string;
	employee: string;
	workedOnWorkshop: boolean;
	source?: string;
}

export enum PlotPointType {
	OVERWATCH_PATCH_NOTE = "overwatch-patch-note",
	EMPLOYEE_STATUS_CHANGE = "blizzard-employee-status-change"
}

export enum PlotPointEvent {
	NOTHING_RELATED_TO_WORKSHOP = 'nothing-related-to-workshop',
	WORKSHOP_BUGFIX = 'workshop-bugfix',
	MAJOR_WORKSHOP_UPDATE = 'major-workshop-update',
	WORKSHOP_DEV_LEAVES = 'workshop-dev-leaves'
}

interface PlotPointBase {
	date: Date;
	type: PlotPointType;
	event: PlotPointEvent;
	weight: number;
	stat: unknown;
}

export type PlotPoint =
	| (PlotPointBase & { type: PlotPointType.OVERWATCH_PATCH_NOTE, stat: PatchNoteStat })
	| (PlotPointBase & { type: PlotPointType.EMPLOYEE_STATUS_CHANGE, stat: BlizzardEmployeeStat })
