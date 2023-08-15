import { Union } from "../fable-library.4.1.3/Types.js";
import { union_type } from "../fable-library.4.1.3/Reflection.js";

export class ErrorValue extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["NotApplicable", "Ref", "Name", "DivZero", "Null", "Value", "Num"];
    }
}

export function ErrorValue_$reflection() {
    return union_type("Fable.ExcelJs.Unions.ErrorValue", [], ErrorValue, () => [[], [], [], [], [], [], []]);
}

export function ErrorValue__get_toString(this$) {
    switch (this$.tag) {
        case 1:
            return "#REF!";
        case 2:
            return "#NAME?";
        case 3:
            return "#DIV/0!";
        case 4:
            return "#NULL!";
        case 5:
            return "#VALUE!";
        case 6:
            return "#NUM!";
        default:
            return "#N/A";
    }
}

export function ErrorValue_ofString_Z721C83C5(str) {
    switch (str) {
        case "#N/A":
            return new ErrorValue(0, []);
        case "#REF!":
            return new ErrorValue(1, []);
        case "#NAME?":
            return new ErrorValue(2, []);
        case "#DIV/0!":
            return new ErrorValue(3, []);
        case "#NULL!":
            return new ErrorValue(4, []);
        case "#VALUE!":
            return new ErrorValue(5, []);
        case "#NUM!":
            return new ErrorValue(6, []);
        default:
            throw new Error("Cannot match input string to ErrorValue");
    }
}

export class StyleOption extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["\'i\'", "\'i+\'", "\'o\'", "\'o+\'", "\'n\'"];
    }
}

export function StyleOption_$reflection() {
    return union_type("Fable.ExcelJs.Unions.StyleOption", [], StyleOption, () => [[], [], [], [], []]);
}

