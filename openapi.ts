import type { OpenAPIV3_1 } from "openapi-types";
import type { Method } from "@fartlabs/rt";
import { Router } from "@fartlabs/rt";
import { Procedure } from "./labs.ts";

type Response200Of<T extends OpenAPIV3_1.OperationObject> = T extends {
  responses: {
    200: { content: { "application/json": { schema: infer U } } };
  };
} ? U
  : never;

const schema = {
  openapi: "3.1.0",
  info: {
    title: "Greet API",
    version: "1.0.0",
  },
  paths: {
    "/greet": {
      get: {
        parameters: [
          { name: "name", in: "query", schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
} as const satisfies OpenAPIV3_1.Document;

type SchemaResponse200 = Response200Of<typeof schema.paths["/greet"]["get"]>;

type SchemaRequestOf<T extends OpenAPIV3_1.OperationObject> = T extends {
  requestBody: { content: { "application/json": { schema: infer U } } };
} ? U
  : T extends { parameters: { schema: infer U }[] } ? U
  : never;

// deno-lint-ignore no-explicit-any
export type Lab = Record<string, Procedure<any, any>>;

export type LabRouteInput<TRequest, TResponse> =
  | Method
  | Partial<LabRoute<TRequest, TResponse>>;

// TODO: Add openapi metadata for the route.
export interface LabRoute<TRequest, TResponse>
  extends HTTPAdapter<TRequest, TResponse> {
  method: Method;
  pattern: string;
  operation?: OpenAPIV3_1.OperationObject;
}

export interface HTTPAdapter<TRequest, TResponse> {
  adaptRequest: (request: Request) => TRequest | Promise<TRequest>;
  adaptResponse: (response: TResponse) => Response | Promise<Response>;
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
      const { method, pattern: pathname, adaptRequest, adaptResponse } =
        makeLabRoute(
          name,
          labRoute,
        );
      router.with(
        { method, pattern: new URLPattern({ pathname }) },
        async ({ request }) => {
          return await adaptResponse(
            await procedure(await adaptRequest(request)),
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
  return Object.assign(
    {
      method: defaultMethod,
      pattern: defaultURLPatternPathname(name),
      adaptRequest: defaultAdapterRequest,
      adaptResponse: defaultAdapterResponse,
    },
    typeof input === "string" ? { method: input } : input,
  );
}
