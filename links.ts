import { Lab } from "./labs.ts";

export interface Linkable {
  id: string;
  links: { id: string }[];
}

export function link(a: Linkable, b: Linkable): void {
  a.links.push({ id: b.id });
}

export function unlink(a: Linkable, b: Linkable): void {
  a.links = a.links.filter((l) => l.id !== b.id);
}

export const linksLab = new Lab()
  .variable("links", new Map<string, Linkable>())
  .procedure(
    "links.add",
    (request: { id?: string }, { links }): Linkable => {
      const id = request.id ?? crypto.randomUUID();
      const linkable = { id, links: [] };
      links.set(id, linkable);
      return linkable;
    },
    ["links"],
  )
  .procedure(
    "links.get",
    ({ id }: { id: string }, { links }) => {
      return links.get(id);
    },
    ["links"],
  )
  .procedure(
    "links.list",
    (_, { links }) => {
      return Array.from(links.values());
    },
    ["links"],
  )
  .procedure(
    "links.link",
    (
      request: { ids: string[] },
      { "links.get": getLink, "links.add": addLink },
    ) => {
      const linkables = request.ids.map((id) => {
        return getLink({ id }) ?? addLink({ id });
      });

      for (let i = 0; i < linkables.length; i++) {
        for (let j = 0; j < linkables.length; j++) {
          if (i !== j) {
            link(linkables[i], linkables[j]);
          }
        }
      }
    },
    ["links.get", "links.add"],
  )
  .procedure(
    "links.unlink",
    (request: { a: string; b: string }, { "links.get": getLink }) => {
      const a = getLink({ id: request.a });
      if (a === undefined) {
        throw new Error(`No such linkable: ${request.a}`);
      }

      const b = getLink({ id: request.b });
      if (b === undefined) {
        throw new Error(`No such linkable: ${request.b}`);
      }

      unlink(a, b);
    },
    ["links.get"],
  );
