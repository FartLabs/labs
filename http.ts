import type { Method } from "@fartlabs/rt";
import { Router } from "@fartlabs/rt";
import { Procedure } from "./labs.ts";

// deno-lint-ignore no-explicit-any
export type Lab = Record<string, Procedure<any, any>>;

export type LabRouteInput<TRequest, TResponse> =
  | Method
  | {
    method?: Method;
    pattern?: string;
    adapter?: Partial<HTTPAdapter<TRequest, TResponse>>;
  };

export interface LabRoute<TRequest, TResponse> {
  method: Method;
  pattern: string;
  adapter: HTTPAdapter<TRequest, TResponse>;
}

export interface HTTPAdapter<TRequest, TResponse> {
  request: (request: Request) => TRequest | Promise<TRequest>;
  response: (response: TResponse) => Response | Promise<Response>;
}

export const defaultMethod = "POST";

export function defaultURLPatternPathname<TName extends string>(
  name: TName,
) {
  return `/${name}` as const;
}

export function defaultAdapterRequest<TRequest>(
  request: Request,
): Promise<TRequest> {
  return request.json();
}

export function defaultAdapterResponse<TResponse>(
  response: TResponse,
): Response {
  return Response.json(response);
}

export function labRouter<TLab extends Lab>(
  lab: TLab,
  routes: {
    [name in keyof TLab]: TLab[name] extends
      Procedure<infer TRequest, infer TResponse>
      ? LabRouteInput<TRequest, TResponse>[]
      : never;
  },
): Router {
  const router = new Router();
  for (const name in routes) {
    const procedure = lab[name];
    if (typeof procedure !== "function") {
      throw new Error(`No such procedure: ${name}`);
    }

    for (const labRoute of routes[name]) {
      const { method, pattern: pathname, adapter } = makeLabRoute(
        name,
        labRoute,
      );
      router.with(
        { method, pattern: new URLPattern({ pathname }) },
        async ({ request }) => {
          return await adapter.response(
            await procedure(
              await adapter.request(request),
            ),
          );
        },
      );
    }
  }

  return router;
}

function makeLabRoute<TRequest, TResponse, TName extends string>(
  name: TName,
  input: LabRouteInput<TRequest, TResponse>,
): LabRoute<TRequest, TResponse> {
  const labRoute: LabRoute<TRequest, TResponse> = {
    method: defaultMethod,
    pattern: defaultURLPatternPathname(name),
    adapter: {
      request: defaultAdapterRequest,
      response: defaultAdapterResponse,
    },
  };

  if (typeof input === "string") {
    labRoute.method = input;
    return labRoute;
  }

  if (input.method !== undefined) {
    labRoute.method = input.method;
  }

  if (input.pattern !== undefined) {
    labRoute.pattern = input.pattern;
  }

  if (input.adapter !== undefined) {
    if (input.adapter.request !== undefined) {
      labRoute.adapter.request = input.adapter.request;
    }

    if (input.adapter.response !== undefined) {
      labRoute.adapter.response = input.adapter.response;
    }
  }

  return labRoute;
}
