import type { Method } from "@fartlabs/rt";
import { Router } from "@fartlabs/rt";
import { Lab } from "./labs.ts";

export type LabRoute<TRequest, TResponse> =
  | { method: Method }
  | {
    method?: Method;
    pattern?: string;
    adapter?: Partial<HTTPAdapter<TRequest, TResponse>>;
  };

export interface HTTPAdapter<TRequest, TResponse> {
  request: (request: Request) => TRequest | Promise<TRequest>;
  response: (response: TResponse) => Response | Promise<Response>;
}

export const defaultLabMethod = "POST";

export function defaultLabPattern<TName extends string>(
  name: TName,
) {
  return `/${name}` as const;
}

export function defaultLabAdapterRequest<TRequest>(
  request: Request,
): Promise<TRequest> {
  return request.json();
}

export function defaultLabAdapterResponse<TResponse>(
  response: TResponse,
): Response {
  return Response.json(response);
}

export function labRouter<
  T extends Record<PropertyKey, unknown> = Record<PropertyKey, unknown>,
>(
  lab: Lab<T>,
  routes: {
    [name in keyof T]?: T[name] extends (_: unknown) => unknown
      ? LabRoute<Parameters<T[name]>[0], ReturnType<T[name]>>[]
      : never;
  },
): Router {
  const router = new Router();
  for (const name in routes) {
    if (!lab.isProcedure(name)) {
      continue;
    }

    const procedure = lab.get(name) as (_: unknown) => unknown;
    const labRoutes = routes[name];
    if (labRoutes === undefined) {
      continue;
    }

    for (const labRoute of labRoutes) {
      const httpMethod = labRoute.method ?? defaultLabMethod;
      const httpPattern =
        "pattern" in labRoute && labRoute.pattern !== undefined
          ? labRoute.pattern
          : defaultLabPattern(name);
      const adaptRequest =
        ("adapter" in labRoute && labRoute.adapter !== undefined
          ? labRoute.adapter.request
          : defaultLabAdapterRequest) as (
            request: Request,
          ) => Promise<unknown>;
      const adaptResponse =
        ("adapter" in labRoute && labRoute.adapter !== undefined
          ? labRoute.adapter.response
          : defaultLabAdapterResponse) as (
            response: unknown,
          ) => Response;

      // Register the route.
      router.with({
        match({ request, url }) {
          return Promise.resolve(
            request.method.toUpperCase() === httpMethod &&
              new URLPattern({ pathname: httpPattern }).test(url),
          );
        },
        async handle({ request }) {
          return await adaptResponse(
            await procedure(
              await adaptRequest(request),
            ),
          );
        },
      });
    }
  }

  return router;
}
