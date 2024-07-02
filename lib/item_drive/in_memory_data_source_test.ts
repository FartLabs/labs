import { assertEquals } from "@std/assert";
import { InMemoryDataSource } from "./in_memory_data_source.ts";

Deno.test("InMemoryDataSource stores facts", async (t) => {
  const dataSource = new InMemoryDataSource();
  await t.step("insert a fact", async () => {
    await dataSource.insertFact({
      factID: "1",
      attribute: "name",
      value: ["Ethan"],
    });
  });

  await t.step("insert more facts", async () => {
    await dataSource.insertFacts([
      {
        factID: "2",
        attribute: "name",
        value: ["Ash"],
      },
      {
        factID: "3",
        attribute: "name",
        value: ["Dawn"],
      },
    ]);
  });

  await t.step("fetch the fact", async () => {
    const fact = await dataSource.fetchFact("1");
    assertEquals(fact.attribute, "name");
    assertEquals(fact.value, ["Ethan"]);
  });

  await t.step("fetch all facts", async () => {
    const facts = await dataSource.fetchFacts({});
    assertEquals(facts.length, 3);
    assertEquals(facts[0].factID, "1");
    assertEquals(facts[1].factID, "2");
    assertEquals(facts[2].factID, "3");
  });

  await t.step("fetch facts by attribute", async () => {
    const facts = await dataSource.fetchFacts({
      attributes: [
        { attribute: "name", valueIncludes: ["Ethan"] },
      ],
    });
    assertEquals(facts.length, 1);
    assertEquals(facts[0].factID, "1");
  });

  await t.step("fetch facts by missing attribute", async () => {
    const facts = await dataSource.fetchFacts({
      attributes: [
        { attribute: "name", valueIncludes: ["MissingNo."] },
      ],
    });
    assertEquals(facts.length, 0);
  });

  await t.step("fetch facts by multiple attributes", async () => {
    const facts = await dataSource.fetchFacts({
      attributes: [
        { attribute: "name", valueIncludes: ["Ash"] },
      ],
    });
    assertEquals(facts.length, 1);
    assertEquals(facts[0].factID, "2");
  });
});
