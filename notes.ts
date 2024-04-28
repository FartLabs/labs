import { Lab } from "./labs.ts";
import type { MapInterface } from "./map.ts";
import { makeMapLab, procedureSet } from "./map.ts";
import { itemsLab, itemsNamespace, procedureAdd } from "./items.ts";

export interface Note {
  title?: string;
  content: string;
}

export const notesNamespace = "notes" as const;

export const notesLab = makeNotesLab(new Map<string, Note>());

/**
 * makeNotesLab makes a lab for managing note items.
 */
export function makeNotesLab<TMemory>(storage: MapInterface<TMemory>) {
  return new Lab()
    .extend(itemsLab)
    .extend(makeMapLab(notesNamespace, storage))
    .procedure(
      procedureAdd(notesNamespace),
      (
        request: { id?: string; value: TMemory },
        {
          [procedureAdd(itemsNamespace)]: addItem,
          [procedureSet(notesNamespace)]: setNote,
        },
      ) => {
        const itemID = addItem({ id: request.id, datasource: notesNamespace });
        setNote({ key: itemID.id, value: request.value });
        return itemID;
      },
      [procedureAdd(itemsNamespace), procedureSet(notesNamespace)],
    );
}
