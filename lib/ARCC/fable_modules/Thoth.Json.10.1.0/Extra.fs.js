import { empty as empty_1 } from "../fable-library.4.1.4/Map.js";
import { comparePrimitives } from "../fable-library.4.1.4/Util.js";
import { ExtraCoders } from "./Types.fs.js";

export const empty = new ExtraCoders("", empty_1({
    Compare: comparePrimitives,
}));

