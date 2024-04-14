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
}

const lab = new Lab()
  .setResource(
    "std.procedures.add",
    <TName extends string, TProps, TReturnType>(
      props: { name: TName; procedure: (props: TProps) => TReturnType },
    ) => {
      return lab.setResource(props.name, props.procedure);
    },
  )
  .getResource("std.procedures.add")({
    name: "math.add",
    procedure: (props: { a: number; b: number }) => {
      return props.a + props.b;
    },
  });

const result = lab.runResource(
  "math.add",
  {
    name: "math.add",
    procedure: (props: { a: number; b: number }) => {
      return props.a + props.b;
    },
  },
);

// 
console.log(result);
