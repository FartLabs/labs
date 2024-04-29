import { labRouter } from "../http.ts";

export const greetRouter = labRouter({
  greet({ name }: { name: string }) {
    return { message: `Hello, ${name}!` };
  },
}, {
  greet: [{
    method: "GET",
    adapter: {
      request: (request) => {
        const url = new URL(request.url);
        const name = url.searchParams.get("name") ?? "world";
        return { name };
      },
    },
  }],
});

// deno run --allow-net examples/http_example.ts
//
if (import.meta.main) {
  Deno.serve(
    (request) => greetRouter.fetch(request),
  );
}
