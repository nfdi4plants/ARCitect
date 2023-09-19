import { FsRangeAddress__Copy, FsRangeAddress__get_LastAddress, FsRangeAddress__get_FirstAddress, FsRangeAddress_$ctor_7E77A4A0 } from "./Ranges/FsRangeAddress.fs.js";
import { FsAddress__set_RowNumber_Z524259A4, FsAddress__get_RowNumber, FsAddress__get_ColumnNumber, FsAddress_$ctor_Z37302880 } from "./FsAddress.fs.js";
import { FsCellsCollection__Add_2E78CE33, FsCellsCollection__Add_Z21F271A4, FsCellsCollection__GetCellsInRow_Z524259A4, FsCellsCollection_$ctor } from "./Cells/FsCellsCollection.fs.js";
import { exists, map, maxBy, minBy, length } from "../fable-library.4.1.4/Seq.js";
import { toIterator, getEnumerator, comparePrimitives } from "../fable-library.4.1.4/Util.js";
import { FsRangeBase_$reflection, FsRangeBase, FsRangeBase__Cell_Z3407A44B, FsRangeBase__get_RangeAddress, FsRangeBase__Cells_Z2740B3CA } from "./Ranges/FsRangeBase.fs.js";
import { FsCell } from "./Cells/FsCell.fs.js";
import { class_type } from "../fable-library.4.1.4/Reflection.js";

export class FsRow extends FsRangeBase {
    constructor(rangeAddress, cells) {
        super(rangeAddress);
        this["cells@21"] = cells;
    }
    static empty() {
        return new FsRow(FsRangeAddress_$ctor_7E77A4A0(FsAddress_$ctor_Z37302880(0, 0), FsAddress_$ctor_Z37302880(0, 0)), FsCellsCollection_$ctor());
    }
    static createAt(index, cells) {
        const getIndexBy = (f) => {
            if (length(FsCellsCollection__GetCellsInRow_Z524259A4(cells, index)) === 0) {
                return 1;
            }
            else {
                return FsAddress__get_ColumnNumber(f((c) => FsAddress__get_ColumnNumber(c.Address))(FsCellsCollection__GetCellsInRow_Z524259A4(cells, index)).Address) | 0;
            }
        };
        const minColIndex = getIndexBy((projection) => ((source_1) => minBy(projection, source_1, {
            Compare: comparePrimitives,
        }))) | 0;
        const maxColIndex = getIndexBy((projection_1) => ((source_2) => maxBy(projection_1, source_2, {
            Compare: comparePrimitives,
        }))) | 0;
        return new FsRow(FsRangeAddress_$ctor_7E77A4A0(FsAddress_$ctor_Z37302880(index, minColIndex), FsAddress_$ctor_Z37302880(index, maxColIndex)), cells);
    }
    get Cells() {
        const this$ = this;
        return FsRangeBase__Cells_Z2740B3CA(this$, this$["cells@21"]);
    }
    get Index() {
        const this$ = this;
        return FsAddress__get_RowNumber(FsRangeAddress__get_FirstAddress(FsRangeBase__get_RangeAddress(this$))) | 0;
    }
    set Index(i) {
        const this$ = this;
        FsAddress__set_RowNumber_Z524259A4(FsRangeAddress__get_FirstAddress(FsRangeBase__get_RangeAddress(this$)), i);
        FsAddress__set_RowNumber_Z524259A4(FsRangeAddress__get_LastAddress(FsRangeBase__get_RangeAddress(this$)), i);
    }
    get MinColIndex() {
        const this$ = this;
        return FsAddress__get_ColumnNumber(FsRangeAddress__get_FirstAddress(FsRangeBase__get_RangeAddress(this$))) | 0;
    }
    get MaxColIndex() {
        const this$ = this;
        return FsAddress__get_ColumnNumber(FsRangeAddress__get_LastAddress(FsRangeBase__get_RangeAddress(this$))) | 0;
    }
    Copy() {
        const this$ = this;
        const ra = FsRangeAddress__Copy(FsRangeBase__get_RangeAddress(this$));
        const cells = map((c) => c.Copy(), this$.Cells);
        const fcc = FsCellsCollection_$ctor();
        FsCellsCollection__Add_Z21F271A4(fcc, cells);
        return new FsRow(ra, fcc);
    }
    static copy(row) {
        return row.Copy();
    }
    static getIndex(row) {
        return row.Index;
    }
    HasCellAt(colIndex) {
        const this$ = this;
        return exists((c) => (c.ColumnNumber === colIndex), this$.Cells);
    }
    static hasCellAt(colIndex, row) {
        return row.HasCellAt(colIndex);
    }
    Item(columnIndex) {
        const this$ = this;
        return FsRangeBase__Cell_Z3407A44B(this$, FsAddress_$ctor_Z37302880(1, columnIndex), this$["cells@21"]);
    }
    static item(colIndex, row) {
        return row.Item(colIndex);
    }
    TryItem(colIndex) {
        const this$ = this;
        return this$.HasCellAt(colIndex) ? this$.Item(colIndex) : void 0;
    }
    static tryItem(colIndex, row) {
        return row.TryItem(colIndex);
    }
    InsertValueAt(colIndex, value) {
        const this$ = this;
        const cell = new FsCell(value);
        FsCellsCollection__Add_2E78CE33(this$["cells@21"], this$.Index, colIndex, cell);
    }
    static insertValueAt(colIndex, value, row) {
        const value_1 = row.InsertValueAt(colIndex, value);
        return row;
    }
    ToDenseRow() {
        const this$ = this;
        for (let i = this$.MinColIndex; i <= this$.MaxColIndex; i++) {
            this$.Item(i);
        }
    }
    static toDenseRow(row) {
        row.ToDenseRow();
        return row;
    }
    static createDenseRowOf(row) {
        const newRow = row.Copy();
        newRow.ToDenseRow();
        return newRow;
    }
    GetEnumerator() {
        const this$ = this;
        return getEnumerator(this$.Cells);
    }
    [Symbol.iterator]() {
        return toIterator(getEnumerator(this));
    }
    "System.Collections.IEnumerable.GetEnumerator"() {
        const this$ = this;
        return getEnumerator(this$);
    }
}

export function FsRow_$reflection() {
    return class_type("FsSpreadsheet.FsRow", void 0, FsRow, FsRangeBase_$reflection());
}

export function FsRow_$ctor_7678C70A(rangeAddress, cells) {
    return new FsRow(rangeAddress, cells);
}

