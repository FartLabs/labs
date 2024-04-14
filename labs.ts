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
    TResource extends T[TName],
    TProps extends // deno-lint-ignore no-explicit-any
    (TResource extends (...args: any) => any ? Parameters<TResource>[0]
      : never),
    TReturnType extends // deno-lint-ignore no-explicit-any
    (TResource extends (...args: any) => any ? ReturnType<TResource>
      : never),
  >(name: TName, props: TProps): TReturnType {
    const resource = this.get(name);
    if (!resource) {
      throw new Error(`No such resource: ${String(name)}`);
    }

    if (typeof resource !== "function") {
      throw new Error(`Resource is not a function: ${String(name)}`);
    }

    return resource(props);
  }
}

const testDb = new Map<string, string>([
  ["SELECT * FROM users", "User 1, User 2, User 3"],
]);

const lab = new Lab()
  // .variable("db", testDb)
  .procedure(
    "db.query",
    (props: { query: string }, { db }) => {
      return (db as typeof testDb).get(props.query);
    },
    ["db"],
  );

const result = lab.execute(
  "db.query",
  { query: "SELECT * FROM users" },
);

// deno run -A labs.ts
//
console.log(result);
