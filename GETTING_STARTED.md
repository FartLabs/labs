# Getting Started

## Your first lab

The Notes Lab is a simple example that demonstrates the basic concepts of Labs.
Follow the steps below to create a new Lab that manages notes.

1\. Import the `Lab` class in a new TypeScript file, `main.ts`.

```ts
import { Lab } from "./labs.ts";
```

2\. Define the `Note` interface.

```ts
export interface Note {
  title?: string;
  content: string;
}
```

3\. Create a new Lab instance.

```ts
export const notesLab = new Lab();
```

4\. Define the `notes` variable in the Lab.

```ts
export const notesLab = new Lab()
  .variable("notes", new Map<string, Note>());
```

5\. Define the `notes.add` procedure in the Lab.

```ts
export const notesLab = new Lab()
  // ...
  .procedure(
    "notes.add",
    (note: Note, { notes }) => {
      const id = crypto.randomUUID();
      notes.set(id, note);
      return { id };
    },
    ["notes"],
  );
```

6\. Define the `notes.get` procedure in the Lab.

```ts
export const notesLab = new Lab()
  // ...
  .procedure(
    "notes.get",
    ({ id }: { id: string }, { notes }) => {
      return notes.get(id);
    },
    ["notes"],
  );
```

7\. Define the `notes.list` procedure in the Lab.

```ts
export const notesLab = new Lab()
  // ...
  .procedure(
    "notes.list",
    (_, { notes }) => {
      return Array.from(notes.values());
    },
    ["notes"],
  );
```

At this point, the `notesLab` Lab is ready to be used.

8\. Execute the `notes.add` procedure.

```ts
notesLab.execute("notes.add", { title: "Hello", content: "World" });
```

9\. Execute the `notes.list` procedure.

```ts
const notes = notesLab.execute("notes.list", {});
console.log(notes);
```

10\. Test it out!

```ts
import { Lab } from "./labs.ts";

export interface Note {
  title?: string;
  content: string;
}

export const notesLab = new Lab()
  .variable("notes", new Map<string, Note>())
  .procedure(
    "notes.add",
    (note: Note, { notes }) => {
      const id = crypto.randomUUID();
      notes.set(id, note);
      return { id };
    },
    ["notes"],
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

notesLab.execute("notes.add", { title: "Hello", content: "World" });

const notes = notesLab.execute("notes.list", {});
console.log(notes);
```

Run the program and observe the output.

```sh
deno run main.ts
```

---

Developed with ❤️ [**@FartLabs**](https://github.com/FartLabs)
