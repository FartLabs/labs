/**
 * Lab is a collection of resources that can be used together to perform tasks.
 */
export class Lab<T extends Record<PropertyKey, unknown> = {}> {
  #variables = new Map<string, unknown>();

  /**
   * variable sets a variable in the lab.
   */
  // TODO: Replace arguments with options bag.
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
    procedure: (
      props: TProps,
      dependencies: { [K in TDependency]: T[K] },
    ) => TReturnType,
    dependencyNames?: TDependency[],
  ): Lab<T & Record<TName, (props: TProps) => TReturnType>> {
    const dependencies = (dependencyNames ?? [])
      .reduce(
        (acc, key) => {
          acc[key] = this.get(key);
          return acc;
        },
        {} as { [K in TDependency]: T[K] },
      ) ?? {} as { [K in TDependency]: T[K] };
    this.#variables.set(
      name,
      (props: TProps) => procedure(props, dependencies),
    );
    return this as Lab<T & Record<TName, (props: TProps) => TReturnType>>;
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
   * run runs a callable variable in the lab.
   */
  public run<
    TName extends keyof T,
    TResource extends T[TName],
    TProps
      extends (TResource extends (...args: any) => any
        ? Parameters<TResource>[0]
        : never),
    TReturnType
      extends (TResource extends (...args: any) => any ? ReturnType<TResource>
        : never),
  >(name: string, props: TProps): TReturnType {
    const resource = this.get(name);
    if (!resource) {
      throw new Error(`No such resource: ${name}`);
    }

    if (typeof resource !== "function") {
      throw new Error(`Resource is not a function: ${name}`);
    }

    return resource(props);
  }
}

const testDb = new Map<string, string>([
  ["SELECT * FROM users", "User 1, User 2, User 3"],
]);

// In practice, we will have a lab
const lab = new Lab()
  .variable("db", testDb)
  .procedure("db.query", (props: { query: string }, { db }) => {
    return db.get(props.query);
  }, ["db"]);

const result = lab.run(
  "db.query",
  { query: "SELECT * FROM users" },
);

// deno run -A labs.ts
console.log(result);
