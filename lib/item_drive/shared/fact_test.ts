import { assertEquals } from "@std/assert";
import { makeFact } from "./fact.ts";

Deno.test("makeFact makes a fact with a timestamp", () => {
    const fact = makeFact({ attribute: "name", value: ["Ethan"] });
    assertEquals(fact.attribute, "name");
    assertEquals(fact.value, ["Ethan"]);
});
