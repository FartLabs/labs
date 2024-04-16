import { ProcedureLab } from "./procedures.ts";

// deno run -A example.ts
//
// Proof-of-concept Lab.
// Features:
// - add notes via datasource resource, get notes via datasource resource, and list notes via datasource resource.
// - ability to dynamically create datasources and relate items between datasources.
//
// TODO: Add ability to get stored data from itemsLab across other stores.
// Perhaps a new lab that introduces a procedure that assigns procedure names to datasources.
// TODO: Add notes and media labs.
//
if (import.meta.main) {
  const itemsLab = new ProcedureLab()
    .variable("items", new Map<string, Item>())
    .procedure(
      "items.add",
      ({ id, datasource }: ItemID, { items }) => {
        items.set(id, makeItem(datasource, id));
      },
      ["items"],
    )
    .procedure(
      "items.get",
      (id: string, { items }) => {
        return items.get(id);
      },
      ["items"],
    );

  const opinionatedLab = itemsLab
    .clone()
    // .variable("media", new Map<string, Media>())
    .variable("notes", new Map<string, Note>())
    .procedure(
      "notes.add",
      (note: Note, { notes, "items.add": addItem }) => {
        const id = crypto.randomUUID();
        addItem({ id, datasource: "notes" });
        notes.set(id, note);
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

  opinionatedLab.execute("notes.add", {
    content: "Hello, world!",
  });

  // TODO: Second argument is not needed for procedures that feature an empty request.
  const notes = opinionatedLab.execute("notes.list", {});
  console.log(notes);
}

interface ItemID {
  id: string;
  datasource: string;
}

interface Item extends ItemID {
  createdAt: string;
  updatedAt: string;
  relationships: ItemID[];
}

interface Note {
  title?: string;
  content: string;
}

// interface Media {
//   title: string;
//   mediaType: string;
// }

function makeItem(datasource: string, id: string): Item {
  const createdAt = new Date().toISOString();
  return {
    id,
    datasource,
    createdAt,
    updatedAt: createdAt,
    relationships: [],
  };
}
