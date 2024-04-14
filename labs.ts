/**
 * Lab is a collection of resources that can be used together to perform tasks.
 */
export class Lab<
  T extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>,
> {
  #variables = new Map<string, unknown>();

  /**
   * variable sets a variable in the lab.
   */
  public variable<TName extends string, TValue>(
    name: TName,
    value: TValue,
  ): Lab<T & Record<TName, TValue>> {
    this.#variables.set(name, value);
    return this as Lab<T & Record<TName, TValue>>;
  }

  /**
   * procedure sets a callable variable in the lab.
   */
  public procedure<
    TName extends string,
    TDependency extends string,
    TProps,
    TReturnType,
  >(
    name: TName,
    execute: (
      props: TProps,
      dependencies: { [K in TDependency]: T[K] },
    ) => TReturnType,
    dependencyNames?: TDependency[],
  ): Lab<T & Record<TName, (props: TProps) => TReturnType>> {
    const procedure = (props: TProps) => {
      const dependencies = (dependencyNames ?? [])
        .reduce(
          (acc, key) => {
            acc[key] = this.get(key);
            return acc;
          },
          {} as { [K in TDependency]: T[K] },
        );

      return execute(props, dependencies);
    };

    return this.variable(name, procedure);
  }

  /**
   * get returns a variable from the lab.
   */
  public get<TName extends keyof T>(
    name: TName,
  ): T[TName] {
    const value = this.#variables.get(name as string) as
      | T[TName]
      | undefined;
    if (value === undefined) {
      throw new Error(`No such resource: ${String(name)}`);
    }

    return value;
  }

  /**
   * execute executes a callable variable in the lab.
   */
  public execute<
    TName extends keyof T,
    TValue extends T[TName],
    TProps extends // deno-lint-ignore no-explicit-any
    (TValue extends (...args: any) => any ? Parameters<TValue>[0]
      : never),
    TReturnType extends // deno-lint-ignore no-explicit-any
    (TValue extends (...args: any) => any ? ReturnType<TValue>
      : never),
  >(name: TName, props: TProps): TReturnType {
    const value = this.get(name);
    if (!value) {
      throw new Error(`No such resource: ${String(name)}`);
    }

    if (typeof value !== "function") {
      throw new Error(`Resource is not a function: ${String(name)}`);
    }

    return value(props);
  }
}

// deno run -A labs.ts
//
// Proof-of-concept Lab.
// Features:
// - add notes via datasource resource, get notes via datasource resource, and list notes via datasource resource.
// - ability to dynamically create datasources and relate items between datasources.
//
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

interface Movie {
  title: string;
  director: string;
}

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

const itemsLab = new Lab()
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

// TODO: Add ability to get stored data from itemsLab across other stores. Perhaps a new lab that introduces a procedure that assigns procedure names to datasources.
// TODO: Add notes and movies labs.

const lab = itemsLab
  .variable("notes", new Map<string, Note>())
  .variable("movies", new Map<string, Movie>())
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

lab.execute("notes.add", {
  content: "Hello, world!",
});

console.log(lab.execute("notes.list", {}));
