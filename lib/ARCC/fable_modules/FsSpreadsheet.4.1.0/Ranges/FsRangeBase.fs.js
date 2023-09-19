import { equals, defaultOf } from "../../fable-library.4.1.4/Util.js";
import { class_type } from "../../fable-library.4.1.4/Reflection.js";
import { FsRangeAddress__get_LastAddress, FsRangeAddress__get_FirstAddress, FsRangeAddress__Extend_6D30B323 } from "./FsRangeAddress.fs.js";
import { FsAddress__get_FixedColumn, FsAddress__get_FixedRow, FsAddress_$ctor_Z4C746FC0, FsAddress__get_ColumnNumber, FsAddress__get_RowNumber } from "../FsAddress.fs.js";
import { FsCellsCollection__GetCells_7E77A4A0, FsCellsCollection__Add_2E78CE33, FsCellsCollection__TryGetCell_Z37302880, FsCellsCollection__get_MaxColumnNumber, FsCellsCollection__get_MaxRowNumber } from "../Cells/FsCellsCollection.fs.js";
import { printf, toFail } from "../../fable-library.4.1.4/String.js";
import { FsCell } from "../Cells/FsCell.fs.js";

export class FsRangeBase {
    constructor(rangeAddress) {
        this._sortRows = defaultOf();
        this._sortColumns = defaultOf();
        this._rangeAddress = rangeAddress;
        let _id;
        FsRangeBase.IdCounter = ((FsRangeBase.IdCounter + 1) | 0);
        _id = FsRangeBase.IdCounter;
    }
}

export function FsRangeBase_$reflection() {
    return class_type("FsSpreadsheet.FsRangeBase", void 0, FsRangeBase);
}

export function FsRangeBase_$ctor_6A2513BC(rangeAddress) {
    return new FsRangeBase(rangeAddress);
}

(() => {
    FsRangeBase.IdCounter = 0;
})();

export function FsRangeBase__Extend_6D30B323(this$, address) {
    FsRangeAddress__Extend_6D30B323(this$._rangeAddress, address);
}

export function FsRangeBase__get_RangeAddress(this$) {
    return this$._rangeAddress;
}

export function FsRangeBase__set_RangeAddress_6A2513BC(this$, rangeAdress) {
    if (!equals(rangeAdress, this$._rangeAddress)) {
        const oldAddress = this$._rangeAddress;
        this$._rangeAddress = rangeAdress;
    }
}

export function FsRangeBase__Cell_Z3407A44B(this$, cellAddressInRange, cells) {
    const absRow = ((FsAddress__get_RowNumber(cellAddressInRange) + FsAddress__get_RowNumber(FsRangeAddress__get_FirstAddress(FsRangeBase__get_RangeAddress(this$)))) - 1) | 0;
    const absColumn = ((FsAddress__get_ColumnNumber(cellAddressInRange) + FsAddress__get_ColumnNumber(FsRangeAddress__get_FirstAddress(FsRangeBase__get_RangeAddress(this$)))) - 1) | 0;
    if ((absRow <= 0) ? true : (absRow > 1048576)) {
        const arg = FsCellsCollection__get_MaxRowNumber(cells) | 0;
        toFail(printf("Row number must be between 1 and %i"))(arg);
    }
    if ((absColumn <= 0) ? true : (absColumn > 16384)) {
        const arg_1 = FsCellsCollection__get_MaxColumnNumber(cells) | 0;
        toFail(printf("Column number must be between 1 and %i"))(arg_1);
    }
    const cell = FsCellsCollection__TryGetCell_Z37302880(cells, absRow, absColumn);
    if (cell == null) {
        const absoluteAddress = FsAddress_$ctor_Z4C746FC0(absRow, absColumn, FsAddress__get_FixedRow(cellAddressInRange), FsAddress__get_FixedColumn(cellAddressInRange));
        const newCell = FsCell.createEmptyWithAdress(absoluteAddress);
        FsRangeBase__Extend_6D30B323(this$, absoluteAddress);
        const value = FsCellsCollection__Add_2E78CE33(cells, absRow, absColumn, newCell);
        return newCell;
    }
    else {
        return cell;
    }
}

/**
 * Returns the FsCells of this FsRangeBase with the given FsCellsCollection.
 */
export function FsRangeBase__Cells_Z2740B3CA(this$, cells) {
    return FsCellsCollection__GetCells_7E77A4A0(cells, FsRangeAddress__get_FirstAddress(FsRangeBase__get_RangeAddress(this$)), FsRangeAddress__get_LastAddress(FsRangeBase__get_RangeAddress(this$)));
}

/**
 * The number of columns in the FsRangeBase.
 */
export function FsRangeBase__ColumnCount(this$) {
    return (FsAddress__get_ColumnNumber(FsRangeAddress__get_LastAddress(this$._rangeAddress)) - FsAddress__get_ColumnNumber(FsRangeAddress__get_FirstAddress(this$._rangeAddress))) + 1;
}

/**
 * The number of rows in the FsRangeBase.
 */
export function FsRangeBase__RowCount(this$) {
    return (FsAddress__get_RowNumber(FsRangeAddress__get_LastAddress(this$._rangeAddress)) - FsAddress__get_RowNumber(FsRangeAddress__get_FirstAddress(this$._rangeAddress))) + 1;
}

