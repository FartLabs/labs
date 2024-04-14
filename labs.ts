/**
 * Lab is a collection of resources that can be used together to perform tasks.
 */
export class Lab<T extends Record<PropertyKey, unknown> = {}> {
  #resources = new Map<string, unknown>();

  /**
   * setResource adds a resource to the lab.
   */
  public setResource<TName extends string, TResource>(
    name: TName,
    resource: TResource,
  ): Lab<T & Record<TName, TResource>> {
    this.#resources.set(name, resource);
    return this as Lab<T & Record<TName, TResource>>;
  }

  /**
   * getResource returns a resource from the lab.
   */
  public getResource<TName extends keyof T>(
    name: TName,
  ): T[TName] {
    const resource = this.#resources.get(name as string) as
      | T[TName]
      | undefined;
    if (!resource) {
      throw new Error(`No such resource: ${String(name)}`);
    }

    return resource;
  }

  /**
   * runResource runs a resource in the lab.
   */
  public runResource<
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
    const resource = this.getResource(name);
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
  // .setResource("std.procedures.add", ...
  .setResource("db", testDb)
  .setResource("db.query", (props: { query: string }) => {
    const db = lab.getResource("db");
    return db.get(props.query);
  });

const result = lab.runResource(
  "db.query",
  { query: "SELECT * FROM users" },
);

console.log(result);
