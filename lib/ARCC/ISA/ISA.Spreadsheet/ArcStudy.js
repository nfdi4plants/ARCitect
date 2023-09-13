import { FsWorksheet } from "../../fable_modules/FsSpreadsheet.4.1.0/FsWorksheet.fs.js";
import { iterate, isEmpty, choose, map, append, iterateIndexed } from "../../fable_modules/fable-library.4.1.4/Seq.js";
import { SparseRowModule_fromFsRow, SparseRowModule_fromValues, SparseRowModule_writeToSheet } from "./Metadata/SparseTable.js";
import { fromRows as fromRows_1, toRows } from "./Metadata/Study.js";
import { defaultArg } from "../../fable_modules/fable-library.4.1.4/Option.js";
import { getEnumerator } from "../../fable_modules/fable-library.4.1.4/Util.js";
import { ArcStudy } from "../ISA/ArcTypes/ArcTypes.js";
import { createMissingIdentifier } from "../ISA/Identifier.js";
import { empty } from "../../fable_modules/fable-library.4.1.4/List.js";
import { printf, toConsole } from "../../fable_modules/fable-library.4.1.4/String.js";
import { toFsWorksheet, tryFromFsWorksheet } from "./AnnotationTable/ArcTable.js";
import { FsWorkbook } from "../../fable_modules/FsSpreadsheet.4.1.0/FsWorkbook.fs.js";

export function ArcStudy_toMetadataSheet(study, assays) {
    let source_1;
    const sheet = new FsWorksheet("isa_study");
    iterateIndexed((rowI, r) => {
        SparseRowModule_writeToSheet(rowI + 1, r, sheet);
    }, (source_1 = toRows(study, assays), append([SparseRowModule_fromValues(["STUDY"])], source_1)));
    return sheet;
}

export function ArcStudy_fromMetadataSheet(sheet) {
    let en;
    return defaultArg((en = getEnumerator(map(SparseRowModule_fromFsRow, sheet.Rows)), (void en["System.Collections.IEnumerator.MoveNext"](), fromRows_1(2, en)[3])), [ArcStudy.create(createMissingIdentifier()), empty()]);
}

/**
 * Reads an assay from a spreadsheet
 */
export function ARCtrl_ISA_ArcStudy__ArcStudy_fromFsWorkbook_Static_32154C9D(doc) {
    let patternInput;
    const matchValue = doc.TryGetWorksheetByName("isa_study");
    if (matchValue == null) {
        const matchValue_1 = doc.TryGetWorksheetByName("Study");
        if (matchValue_1 == null) {
            toConsole(printf("Cannot retrieve metadata: Study file does not contain \"%s\" or \"%s\" sheet."))("isa_study")("Study");
            patternInput = [ArcStudy.create(createMissingIdentifier()), empty()];
        }
        else {
            patternInput = ArcStudy_fromMetadataSheet(matchValue_1);
        }
    }
    else {
        patternInput = ArcStudy_fromMetadataSheet(matchValue);
    }
    const studyMetadata = patternInput[0];
    const sheets = choose(tryFromFsWorksheet, doc.GetWorksheets());
    return [isEmpty(sheets) ? studyMetadata : ((studyMetadata.Tables = Array.from(sheets), studyMetadata)), patternInput[1]];
}

export function ARCtrl_ISA_ArcStudy__ArcStudy_toFsWorkbook_Static_Z2A9662E9(study, assays) {
    const doc = new FsWorkbook();
    const metaDataSheet = ArcStudy_toMetadataSheet(study, assays);
    doc.AddWorksheet(metaDataSheet);
    iterate((arg_1) => {
        const arg = toFsWorksheet(arg_1);
        doc.AddWorksheet(arg);
    }, study.Tables);
    return doc;
}

