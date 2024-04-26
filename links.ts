import { Lab } from "./labs.ts";

export interface LinkableID {
  id: string;
  property?: string;
}

export interface Linkable extends LinkableID {
  links: LinkableID[];
}

export interface AddLinkRequest {
  id?: string;
  property?: string;
}

function makeLinkable(
  id?: string,
  property?: string,
): Linkable {
  return { id: id ?? crypto.randomUUID(), property, links: [] };
}

function linkableKey(linkableID: LinkableID): string {
  return `${linkableID.id}${
    linkableID.property ? `:${linkableID.property}` : ""
  }`;
}

export const linksLab = new Lab()
  .variable("links", new Map<string, Linkable>())
  .procedure(
    "links.add",
    (request: AddLinkRequest, { links }): Linkable => {
      const linkable = makeLinkable(request.id, request.property);
      links.set(linkableKey(linkable), linkable);
      return linkable;
    },
    ["links"],
  )
  .procedure(
    "links.get",
    (request: LinkableID, { links }): Linkable | undefined => {
      return links.get(linkableKey(request));
    },
    ["links"],
  )
  .procedure(
    "links.list",
    (_, { links }): Linkable[] => {
      return Array.from(links.values());
    },
    ["links"],
  )
  .procedure(
    "links.link",
    (
      request: { linkIDs: LinkableID[] },
      { "links.get": getLink, "links.add": addLink },
    ): void => {
      const linkables = request.linkIDs.map((id) => {
        return getLink(id) ?? addLink(id);
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
    (request: { a: string; b: string }, { "links.get": getLink }): void => {
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

export function link(a: Linkable, b: Linkable): void {
  a.links.push({ id: b.id });
}

export function unlink(a: Linkable, b: Linkable): void {
  a.links = a.links.filter((l) => l.id !== b.id);
}
