import { labRouter } from "../openapi.ts";

export const greetRouter = labRouter(
  {
    greet({ name }: { name?: string }) {
      return { message: `Hello, ${name ?? "world"}!` };
    },
  },
  {
    greet: [
      {
        method: "GET",
        adaptRequest: (request) => {
          const url = new URL(request.url);
          const name = url.searchParams.get("name") ?? undefined;
          return { name };
        },
        operation: {
          parameters: [
            { name: "name", in: "query", schema: { type: "string" } },
          ],
        },
      },
    ],
  },
);

// deno run --allow-net examples/http_example.ts
//
if (import.meta.main) {
  Deno.serve(
    (request) => greetRouter.fetch(request),
  );
}

// TODO: Proof of concept.
// - A lab that can be interpreted as a REST API server router.
// - A lab that can be interpreted as a REST API client.

// Storage systems:
// - Users. { username }
// - Projects. { name, description, ownerID }
// - Labs. { name, description, ownerID }
// - Views. { name, props, renderFn }
// - Services/Strategies.
// - Items.
// - Links.
// - Pokemon.
// - TODOs/Tasks/Reminders.
// - Notes.
// - Emails.
