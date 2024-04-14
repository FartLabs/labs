/**
 * Lab is a collection of resources that can be used together to perform tasks.
 */
export class Lab<T extends Record<PropertyKey, unknown> = {}> {
  #variables = new Map<string, unknown>();

  /**
   * variable sets a variable in the lab.
   */
  public variable<TName extends string, TValue>(
    options: { name: TName; value: TValue },
  ): Lab<T & Record<TName, TValue>> {
    this.#variables.set(options.name, options.value);
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
    options: {
      /**
       * name is the name of the procedure.
       */
      name: TName;

      /**
       * dependencies are the names of the variables/procedures that this
       * procedure depends on.
       */
      dependencies?: TDependency[];

      /**
       * execute invokes the procedure with the given props and dependencies.
       */
      execute: (
        props: TProps,
        dependencies: { [K in TDependency]: T[K] },
      ) => TReturnType;
    },
  ): Lab<T & Record<TName, (props: TProps) => TReturnType>> {
    const dependencies = (options.dependencies ?? [])
      .reduce(
        (acc, key) => {
          acc[key] = this.get(key);
          return acc;
        },
        {} as { [K in TDependency]: T[K] },
      ) ?? {} as { [K in TDependency]: T[K] };
    this.#variables.set(
      options.name,
      (props: TProps) => options.execute(props, dependencies),
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

const lab = new Lab()
  .variable({ name: "db", value: testDb })
  .procedure({
    name: "db.query",
    dependencies: ["db"],
    execute(props: { query: string }, { db }) {
      return db.get(props.query);
    },
  });

const result = lab.run(
  "db.query",
  { query: "SELECT * FROM users" },
);

// deno run -A labs.ts
console.log(result);
