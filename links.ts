import { Lab } from "./labs.ts";
import type { MapInterface } from "./map.ts";
import { makeMapLab, procedureGet, procedureSet } from "./map.ts";

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

export const linksNamespace = "links" as const;

export const linksLab = makeLinksLab(new Map());

/**
 * makeLinksLab makes a lab for managing links.
 */
export function makeLinksLab(storage: MapInterface<Linkable>) {
  return new Lab()
    .extend(makeMapLab(linksNamespace, storage))
    .procedure(
      procedureAddLink(linksNamespace),
      (
        request: AddLinkRequest,
        { [procedureSet(linksNamespace)]: setLink },
      ): Linkable => {
        const linkable = makeLinkable(request.id, request.property);
        setLink({ key: linkableKey(linkable), value: linkable });
        return linkable;
      },
      [procedureSet(linksNamespace)],
    )
    .procedure(
      procedureLink(linksNamespace),
      (
        request: { linkIDs: LinkableID[] },
        {
          [procedureGet(linksNamespace)]: getLink,
          [procedureAddLink(linksNamespace)]: addLink,
        },
      ): void => {
        const linkables = request.linkIDs
          .map((id) => getLink({ key: linkableKey(id) }) ?? addLink(id));

        for (let i = 0; i < linkables.length; i++) {
          for (let j = 0; j < linkables.length; j++) {
            if (i === j) {
              continue;
            }

            link(linkables[i], linkables[j]);
          }
        }
      },
      [procedureGet(linksNamespace), procedureAddLink(linksNamespace)],
    )
    .procedure(
      procedureUnlink(linksNamespace),
      (
        request: { a: LinkableID; b: LinkableID },
        { [procedureGet(linksNamespace)]: getLink },
      ): void => {
        const a = getLink({ key: linkableKey(request.a) });
        if (a === undefined) {
          throw new Error(`No such linkable: ${request.a}`);
        }

        const b = getLink({ key: linkableKey(request.b) });
        if (b === undefined) {
          throw new Error(`No such linkable: ${request.b}`);
        }

        unlink(a, b);
        unlink(b, a);
      },
      [procedureGet(linksNamespace)],
    );
}

export function link(a: Linkable, b: Linkable): void {
  a.links.push(b);
}

export function unlink(a: Linkable, b: Linkable): void {
  a.links = a.links.filter((l) => l.id !== b.id);
}

function makeLinkable(
  id: string = crypto.randomUUID(),
  property?: string,
): Linkable {
  return { id, property, links: [] };
}

function linkableKey(linkableID: LinkableID): string {
  return `${linkableID.id}${
    linkableID.property ? `:${linkableID.property}` : ""
  }`;
}

export function procedureAddLink<TNamespace extends string>(
  namespace: TNamespace,
) {
  return `${namespace}.addLink` as const;
}

export function procedureLink<TNamespace extends string>(
  namespace: TNamespace,
) {
  return `${namespace}.link` as const;
}

export function procedureUnlink<TNamespace extends string>(
  namespace: TNamespace,
) {
  return `${namespace}.unlink` as const;
}
