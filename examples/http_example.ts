import { labRouter } from "../http.ts";
import { myLab } from "../example.ts";

export const myLabRouter = labRouter(myLab, {
  //   "links.list": {
  //     method: "GET",
  //     pattern: "/links",
  //   },
  // TODO: ??
  "notes.list": undefined,
  "items.list": [],
});
