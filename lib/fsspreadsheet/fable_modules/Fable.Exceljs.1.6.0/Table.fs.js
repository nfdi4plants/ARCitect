import { Union } from "../fable-library.4.1.3/Types.js";
import { union_type } from "../fable-library.4.1.3/Reflection.js";

export class TotalsFunctions extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Total", "none", "average", "countNums", "count", "max", "min", "stdDev", "var", "sum", "custom"];
    }
}

export function TotalsFunctions_$reflection() {
    return union_type("Fable.ExcelJs.Table.TotalsFunctions", [], TotalsFunctions, () => [[], [], [], [], [], [], [], [], [], [], []]);
}

export function TotalsFunctions_get_defaultValue() {
    return new TotalsFunctions(0, []);
}

