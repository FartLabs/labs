import { Lab } from "./labs.ts";
import { linksLab } from "./links.ts";
import { itemsLab } from "./items.ts";

export interface Note {
  title?: string;
  content: string;
}

export const notesLab = new Lab()
  .import(itemsLab)
  .import(linksLab)
  .variable("notes", new Map<string, Note>())
  .procedure(
    "notes.add",
    (note: Note, { notes, "items.add": addItem }) => {
      const itemID = addItem({ datasource: "notes" });
      notes.set(itemID.id, note);
      return itemID;
    },
    ["notes", "items.add"],
  )
  .procedure(
    "notes.get",
    ({ id }: { id: string }, { notes }) => {
      return notes.get(id);
    },
    ["notes"],
  )
  .procedure(
    "notes.list",
    (_, { notes }) => {
      return Array.from(notes.values());
    },
    ["notes"],
  );
