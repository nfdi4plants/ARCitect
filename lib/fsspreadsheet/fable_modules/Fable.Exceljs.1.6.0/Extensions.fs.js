import { createObj } from "../fable-library.4.1.3/Util.js";
import { empty, append, singleton, collect, delay, toList } from "../fable-library.4.1.3/Seq.js";
import { value } from "../fable-library.4.1.3/Option.js";

/**
 * create js object with `column.key` as key and row value as value.
 * Can be used e.g for insertRow, addRow.
 */
export function Fable_ExcelJs_Row_Row__Row_createValues_Static_68BDC580(keyValueSeq) {
    return createObj(toList(delay(() => collect((matchValue) => singleton([matchValue[0], matchValue[1]]), keyValueSeq))));
}

export function Fable_ExcelJs_Column_Column__Column_create_Static_3ECA26A(header, key, width, outlineLevel, hidden) {
    return createObj(toList(delay(() => append(singleton(["header", header]), delay(() => append((key != null) ? singleton(["key", value(key)]) : empty(), delay(() => append((width != null) ? singleton(["width", value(width)]) : empty(), delay(() => append((outlineLevel != null) ? singleton(["outlineLevel", value(outlineLevel)]) : empty(), delay(() => ((hidden != null) ? singleton(["hidden", value(hidden)]) : empty()))))))))))));
}

export function Fable_ExcelJs_Worksheet_WorksheetProperties__WorksheetProperties_create_Static_Z119EA819(tabColor, outlineLevelCol, outlineLevelRow, defaultRowHeight, defaultColWidth, dyDescent) {
    return createObj(toList(delay(() => append((tabColor != null) ? singleton(["tabColor", value(tabColor)]) : empty(), delay(() => append((outlineLevelCol != null) ? singleton(["outlineLevelCol", value(outlineLevelCol)]) : empty(), delay(() => append((outlineLevelRow != null) ? singleton(["outlineLevelRow", value(outlineLevelRow)]) : empty(), delay(() => append((defaultRowHeight != null) ? singleton(["defaultRowHeight", value(defaultRowHeight)]) : empty(), delay(() => append((defaultColWidth != null) ? singleton(["defaultColWidth", value(defaultColWidth)]) : empty(), delay(() => ((dyDescent != null) ? singleton(["dyDescent", value(dyDescent)]) : empty()))))))))))))));
}

