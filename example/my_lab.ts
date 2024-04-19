import { Lab } from "../labs.ts";
import { linksLab } from "../links.ts";
import { notesLab } from "../notes.ts";

export const myLab = new Lab()
  .extend(notesLab)
  .extend(linksLab);
