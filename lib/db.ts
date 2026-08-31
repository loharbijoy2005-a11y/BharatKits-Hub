import Dexie, { type Table } from "dexie";

export interface ScratchpadNote {
  id?: number;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export class OmniKitsDatabase extends Dexie {
  scratchpads!: Table<ScratchpadNote, number>;

  constructor() {
    super("OmniKitsDatabase");
    this.version(1).stores({
      scratchpads: "++id, title, createdAt, updatedAt",
    });
  }
}

export const db = new OmniKitsDatabase();
