import { map as map_1, defaultArg, unwrap } from "../../../fable_modules/fable-library.4.1.4/Option.js";
import { ArcTables_fromProcesses_134EBDED, ArcTables__get_Tables, ArcTables__GetProcesses, ArcTables__GetRow_Z18115A39, ArcTables__GetRowAt_Z37302880, ArcTables__UpdateRow_1BFE2CFB, ArcTables__UpdateRowAt_1CF7B5DC, ArcTables__RemoveRow_Z18115A39, ArcTables__RemoveRowAt_Z37302880, ArcTables__AddRow_Z16315DE5, ArcTables__AddRowAt_Z12CDB784, ArcTables__GetColumn_Z18115A39, ArcTables__GetColumnAt_Z37302880, ArcTables__UpdateColumn_Z6083042A, ArcTables__UpdateColumnAt_21300791, ArcTables__RemoveColumn_Z18115A39, ArcTables__RemoveColumnAt_Z37302880, ArcTables__AddColumn_1FF50D3C, ArcTables__AddColumnAt_6A9784DB, ArcTables__RenameTable_Z384F8060, ArcTables__RenameTableAt_Z176EF219, ArcTables__MapTable_27DD7B1B, ArcTables__MapTableAt_8FC095C, ArcTables__RemoveTable_Z721C83C5, ArcTables__RemoveTableAt_Z524259A4, ArcTables__SetTable_51766571, ArcTables__SetTableAt_7E571736, ArcTables__UpdateTable_51766571, ArcTables__UpdateTableAt_7E571736, ArcTables__GetTable_Z721C83C5, ArcTables__GetTableAt_Z524259A4, ArcTables__InitTables_7B28792B, ArcTables__InitTable_3B406CA4, ArcTables__AddTables_Z2D453886, ArcTables__AddTable_EC12B15, ArcTables__get_TableNames, ArcTables_$ctor_Z18C2F36D, ArcTables__get_Count } from "./ArcTables.js";
import { defaultOf, stringHash, safeHash, equals, disposeSafe, getEnumerator } from "../../../fable_modules/fable-library.4.1.4/Util.js";
import { tryFind as tryFind_1, removeInPlace, equalsWith, append as append_8, contains, map } from "../../../fable_modules/fable-library.4.1.4/Array.js";
import { distinctBy, groupBy, Array_distinct } from "../../../fable_modules/fable-library.4.1.4/Seq2.js";
import { printf, toText } from "../../../fable_modules/fable-library.4.1.4/String.js";
import { create, match } from "../../../fable_modules/fable-library.4.1.4/RegExp.js";
import { OntologyAnnotation } from "../JsonTypes/OntologyAnnotation.js";
import { Value_fromString_Z721C83C5, Value__get_Text } from "../JsonTypes/Value.js";
import { AnnotationValue } from "../JsonTypes/AnnotationValue.js";
import { AssayMaterials_get_empty, AssayMaterials_create_Z253F0553 } from "../JsonTypes/AssayMaterials.js";
import { fromValueWithDefault } from "../OptionExtensions.js";
import { unzip, ofSeq, map as map_3, toArray, ofArray, empty } from "../../../fable_modules/fable-library.4.1.4/List.js";
import { getSources, getProtocols, getUnits, getCharacteristics, getData, getMaterials, getSamples } from "../JsonTypes/ProcessSequence.js";
import { Assay_create_3D372A24 } from "../JsonTypes/Assay.js";
import { Study_identifierFromFileName, Study_fileNameFromIdentifier, Assay_identifierFromFileName, createMissingIdentifier, Assay_fileNameFromIdentifier, isMissingIdentifier } from "../Identifier.js";
import { class_type } from "../../../fable_modules/fable-library.4.1.4/Reflection.js";
import { concat, toList, tryFind, removeAt, tryFindIndex, append as append_9, head, item, length, map as map_2, contains as contains_1 } from "../../../fable_modules/fable-library.4.1.4/Seq.js";
import { StudyMaterials_get_empty, StudyMaterials_create_1BE9FA55 } from "../JsonTypes/StudyMaterials.js";
import { Study_create_Z2D28E954 } from "../JsonTypes/Study.js";
import { Investigation_create_4AD66BBE } from "../JsonTypes/Investigation.js";
import { FSharpRef } from "../../../fable_modules/fable-library.4.1.4/Types.js";

export class ArcAssay {
    constructor(identifier, measurementType, technologyType, technologyPlatform, tables, performers, comments) {
        const tables_1 = defaultArg(tables, []);
        const performers_1 = defaultArg(performers, []);
        const comments_1 = defaultArg(comments, []);
        this["identifier@86"] = identifier;
        this.investigation = void 0;
        this["MeasurementType@"] = measurementType;
        this["TechnologyType@"] = technologyType;
        this["TechnologyPlatform@"] = technologyPlatform;
        this["Tables@"] = tables_1;
        this["Performers@"] = performers_1;
        this["Comments@"] = comments_1;
    }
    get Identifier() {
        const this$ = this;
        return this$["identifier@86"];
    }
    set Identifier(i) {
        const this$ = this;
        this$["identifier@86"] = i;
    }
    get Investigation() {
        const this$ = this;
        return unwrap(this$.investigation);
    }
    set Investigation(i) {
        const this$ = this;
        this$.investigation = i;
    }
    static get FileName() {
        return "isa.assay.xlsx";
    }
    get MeasurementType() {
        const __ = this;
        return unwrap(__["MeasurementType@"]);
    }
    set MeasurementType(v) {
        const __ = this;
        __["MeasurementType@"] = v;
    }
    get TechnologyType() {
        const __ = this;
        return unwrap(__["TechnologyType@"]);
    }
    set TechnologyType(v) {
        const __ = this;
        __["TechnologyType@"] = v;
    }
    get TechnologyPlatform() {
        const __ = this;
        return unwrap(__["TechnologyPlatform@"]);
    }
    set TechnologyPlatform(v) {
        const __ = this;
        __["TechnologyPlatform@"] = v;
    }
    get Tables() {
        const __ = this;
        return __["Tables@"];
    }
    set Tables(v) {
        const __ = this;
        __["Tables@"] = v;
    }
    get Performers() {
        const __ = this;
        return __["Performers@"];
    }
    set Performers(v) {
        const __ = this;
        __["Performers@"] = v;
    }
    get Comments() {
        const __ = this;
        return __["Comments@"];
    }
    set Comments(v) {
        const __ = this;
        __["Comments@"] = v;
    }
    static init(identifier) {
        return new ArcAssay(identifier);
    }
    static create(identifier, measurementType, technologyType, technologyPlatform, tables, performers, comments) {
        return new ArcAssay(identifier, unwrap(measurementType), unwrap(technologyType), unwrap(technologyPlatform), unwrap(tables), unwrap(performers), unwrap(comments));
    }
    static make(identifier, measurementType, technologyType, technologyPlatform, tables, performers, comments) {
        return new ArcAssay(identifier, unwrap(measurementType), unwrap(technologyType), unwrap(technologyPlatform), tables, performers, comments);
    }
    get TableCount() {
        const this$ = this;
        return ArcTables__get_Count(ArcTables_$ctor_Z18C2F36D(this$.Tables)) | 0;
    }
    get TableNames() {
        const this$ = this;
        return ArcTables__get_TableNames(ArcTables_$ctor_Z18C2F36D(this$.Tables));
    }
    AddTable(table, index) {
        const this$ = this;
        ArcTables__AddTable_EC12B15(ArcTables_$ctor_Z18C2F36D(this$.Tables), table, unwrap(index));
    }
    static addTable(table, index) {
        return (assay) => {
            const c = assay.Copy();
            c.AddTable(table, unwrap(index));
            return c;
        };
    }
    AddTables(tables, index) {
        const this$ = this;
        ArcTables__AddTables_Z2D453886(ArcTables_$ctor_Z18C2F36D(this$.Tables), tables, unwrap(index));
    }
    static addTables(tables, index) {
        return (assay) => {
            const c = assay.Copy();
            c.AddTables(tables, unwrap(index));
            return c;
        };
    }
    InitTable(tableName, index) {
        const this$ = this;
        return ArcTables__InitTable_3B406CA4(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, unwrap(index));
    }
    static initTable(tableName, index) {
        return (assay) => {
            const c = assay.Copy();
            return [c, c.InitTable(tableName, unwrap(index))];
        };
    }
    InitTables(tableNames, index) {
        const this$ = this;
        ArcTables__InitTables_7B28792B(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableNames, unwrap(index));
    }
    static initTables(tableNames, index) {
        return (assay) => {
            const c = assay.Copy();
            c.InitTables(tableNames, unwrap(index));
            return c;
        };
    }
    GetTableAt(index) {
        const this$ = this;
        return ArcTables__GetTableAt_Z524259A4(ArcTables_$ctor_Z18C2F36D(this$.Tables), index);
    }
    static getTableAt(index) {
        return (assay) => {
            const newAssay = assay.Copy();
            return newAssay.GetTableAt(index);
        };
    }
    GetTable(name) {
        const this$ = this;
        return ArcTables__GetTable_Z721C83C5(ArcTables_$ctor_Z18C2F36D(this$.Tables), name);
    }
    static getTable(name) {
        return (assay) => {
            const newAssay = assay.Copy();
            return newAssay.GetTable(name);
        };
    }
    UpdateTableAt(index, table) {
        const this$ = this;
        ArcTables__UpdateTableAt_7E571736(ArcTables_$ctor_Z18C2F36D(this$.Tables), index, table);
    }
    static updateTableAt(index, table) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.UpdateTableAt(index, table);
            return newAssay;
        };
    }
    UpdateTable(name, table) {
        const this$ = this;
        ArcTables__UpdateTable_51766571(ArcTables_$ctor_Z18C2F36D(this$.Tables), name, table);
    }
    static updateTable(name, table) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.UpdateTable(name, table);
            return newAssay;
        };
    }
    SetTableAt(index, table) {
        const this$ = this;
        ArcTables__SetTableAt_7E571736(ArcTables_$ctor_Z18C2F36D(this$.Tables), index, table);
    }
    static setTableAt(index, table) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.SetTableAt(index, table);
            return newAssay;
        };
    }
    SetTable(name, table) {
        const this$ = this;
        ArcTables__SetTable_51766571(ArcTables_$ctor_Z18C2F36D(this$.Tables), name, table);
    }
    static setTable(name, table) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.SetTable(name, table);
            return newAssay;
        };
    }
    RemoveTableAt(index) {
        const this$ = this;
        ArcTables__RemoveTableAt_Z524259A4(ArcTables_$ctor_Z18C2F36D(this$.Tables), index);
    }
    static removeTableAt(index) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.RemoveTableAt(index);
            return newAssay;
        };
    }
    RemoveTable(name) {
        const this$ = this;
        ArcTables__RemoveTable_Z721C83C5(ArcTables_$ctor_Z18C2F36D(this$.Tables), name);
    }
    static removeTable(name) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.RemoveTable(name);
            return newAssay;
        };
    }
    MapTableAt(index, updateFun) {
        const this$ = this;
        ArcTables__MapTableAt_8FC095C(ArcTables_$ctor_Z18C2F36D(this$.Tables), index, updateFun);
    }
    static mapTableAt(index, updateFun) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.MapTableAt(index, updateFun);
            return newAssay;
        };
    }
    MapTable(name, updateFun) {
        const this$ = this;
        ArcTables__MapTable_27DD7B1B(ArcTables_$ctor_Z18C2F36D(this$.Tables), name, updateFun);
    }
    static updateTable(name, updateFun) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.MapTable(name, updateFun);
            return newAssay;
        };
    }
    RenameTableAt(index, newName) {
        const this$ = this;
        ArcTables__RenameTableAt_Z176EF219(ArcTables_$ctor_Z18C2F36D(this$.Tables), index, newName);
    }
    static renameTableAt(index, newName) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.RenameTableAt(index, newName);
            return newAssay;
        };
    }
    RenameTable(name, newName) {
        const this$ = this;
        ArcTables__RenameTable_Z384F8060(ArcTables_$ctor_Z18C2F36D(this$.Tables), name, newName);
    }
    static renameTable(name, newName) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.RenameTable(name, newName);
            return newAssay;
        };
    }
    AddColumnAt(tableIndex, header, cells, columnIndex, forceReplace) {
        const this$ = this;
        ArcTables__AddColumnAt_6A9784DB(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableIndex, header, unwrap(cells), unwrap(columnIndex), unwrap(forceReplace));
    }
    static addColumnAt(tableIndex, header, cells, columnIndex, forceReplace) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.AddColumnAt(tableIndex, header, unwrap(cells), unwrap(columnIndex), unwrap(forceReplace));
            return newAssay;
        };
    }
    AddColumn(tableName, header, cells, columnIndex, forceReplace) {
        const this$ = this;
        ArcTables__AddColumn_1FF50D3C(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, header, unwrap(cells), unwrap(columnIndex), unwrap(forceReplace));
    }
    static addColumn(tableName, header, cells, columnIndex, forceReplace) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.AddColumn(tableName, header, unwrap(cells), unwrap(columnIndex), unwrap(forceReplace));
            return newAssay;
        };
    }
    RemoveColumnAt(tableIndex, columnIndex) {
        const this$ = this;
        ArcTables__RemoveColumnAt_Z37302880(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableIndex, columnIndex);
    }
    static removeColumnAt(tableIndex, columnIndex) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.RemoveColumnAt(tableIndex, columnIndex);
            return newAssay;
        };
    }
    RemoveColumn(tableName, columnIndex) {
        const this$ = this;
        ArcTables__RemoveColumn_Z18115A39(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, columnIndex);
    }
    static removeColumn(tableName, columnIndex) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.RemoveColumn(tableName, columnIndex);
            return newAssay;
        };
    }
    UpdateColumnAt(tableIndex, columnIndex, header, cells) {
        const this$ = this;
        ArcTables__UpdateColumnAt_21300791(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableIndex, columnIndex, header, unwrap(cells));
    }
    static updateColumnAt(tableIndex, columnIndex, header, cells) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.UpdateColumnAt(tableIndex, columnIndex, header, unwrap(cells));
            return newAssay;
        };
    }
    UpdateColumn(tableName, columnIndex, header, cells) {
        const this$ = this;
        ArcTables__UpdateColumn_Z6083042A(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, columnIndex, header, unwrap(cells));
    }
    static updateColumn(tableName, columnIndex, header, cells) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.UpdateColumn(tableName, columnIndex, header, unwrap(cells));
            return newAssay;
        };
    }
    GetColumnAt(tableIndex, columnIndex) {
        const this$ = this;
        return ArcTables__GetColumnAt_Z37302880(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableIndex, columnIndex);
    }
    static getColumnAt(tableIndex, columnIndex) {
        return (assay) => {
            const newAssay = assay.Copy();
            return newAssay.GetColumnAt(tableIndex, columnIndex);
        };
    }
    GetColumn(tableName, columnIndex) {
        const this$ = this;
        return ArcTables__GetColumn_Z18115A39(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, columnIndex);
    }
    static getColumn(tableName, columnIndex) {
        return (assay) => {
            const newAssay = assay.Copy();
            return newAssay.GetColumn(tableName, columnIndex);
        };
    }
    AddRowAt(tableIndex, cells, rowIndex) {
        const this$ = this;
        ArcTables__AddRowAt_Z12CDB784(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableIndex, unwrap(cells), unwrap(rowIndex));
    }
    static addRowAt(tableIndex, cells, rowIndex) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.AddRowAt(tableIndex, unwrap(cells), unwrap(rowIndex));
            return newAssay;
        };
    }
    AddRow(tableName, cells, rowIndex) {
        const this$ = this;
        ArcTables__AddRow_Z16315DE5(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, unwrap(cells), unwrap(rowIndex));
    }
    static addRow(tableName, cells, rowIndex) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.AddRow(tableName, unwrap(cells), unwrap(rowIndex));
            return newAssay;
        };
    }
    RemoveRowAt(tableIndex, rowIndex) {
        const this$ = this;
        ArcTables__RemoveRowAt_Z37302880(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableIndex, rowIndex);
    }
    static removeRowAt(tableIndex, rowIndex) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.RemoveColumnAt(tableIndex, rowIndex);
            return newAssay;
        };
    }
    RemoveRow(tableName, rowIndex) {
        const this$ = this;
        ArcTables__RemoveRow_Z18115A39(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, rowIndex);
    }
    static removeRow(tableName, rowIndex) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.RemoveRow(tableName, rowIndex);
            return newAssay;
        };
    }
    UpdateRowAt(tableIndex, rowIndex, cells) {
        const this$ = this;
        ArcTables__UpdateRowAt_1CF7B5DC(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableIndex, rowIndex, cells);
    }
    static updateRowAt(tableIndex, rowIndex, cells) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.UpdateRowAt(tableIndex, rowIndex, cells);
            return newAssay;
        };
    }
    UpdateRow(tableName, rowIndex, cells) {
        const this$ = this;
        ArcTables__UpdateRow_1BFE2CFB(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, rowIndex, cells);
    }
    static updateRow(tableName, rowIndex, cells) {
        return (assay) => {
            const newAssay = assay.Copy();
            newAssay.UpdateRow(tableName, rowIndex, cells);
            return newAssay;
        };
    }
    GetRowAt(tableIndex, rowIndex) {
        const this$ = this;
        return ArcTables__GetRowAt_Z37302880(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableIndex, rowIndex);
    }
    static getRowAt(tableIndex, rowIndex) {
        return (assay) => {
            const newAssay = assay.Copy();
            return newAssay.GetRowAt(tableIndex, rowIndex);
        };
    }
    GetRow(tableName, rowIndex) {
        const this$ = this;
        return ArcTables__GetRow_Z18115A39(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, rowIndex);
    }
    static getRow(tableName, rowIndex) {
        return (assay) => {
            const newAssay = assay.Copy();
            return newAssay.GetRow(tableName, rowIndex);
        };
    }
    static setPerformers(performers, assay) {
        assay.Performers = performers;
        return assay;
    }
    Copy() {
        const this$ = this;
        const nextTables = [];
        let enumerator = getEnumerator(this$.Tables);
        try {
            while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                const table = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
                const copy = table.Copy();
                void (nextTables.push(copy));
            }
        }
        finally {
            disposeSafe(enumerator);
        }
        const nextComments = map((c) => c.Copy(), this$.Comments);
        const nextPerformers = map((c_1) => c_1.Copy(), this$.Performers);
        return new ArcAssay(this$.Identifier, unwrap(this$.MeasurementType), unwrap(this$.TechnologyType), unwrap(this$.TechnologyPlatform), nextTables, nextPerformers, nextComments);
    }
    UpdateBy(assay, onlyReplaceExisting, appendSequences) {
        const this$ = this;
        const onlyReplaceExisting_1 = defaultArg(onlyReplaceExisting, false);
        const appendSequences_1 = defaultArg(appendSequences, false);
        const updateAlways = !onlyReplaceExisting_1;
        if ((assay.MeasurementType != null) ? true : updateAlways) {
            this$.MeasurementType = assay.MeasurementType;
        }
        if ((assay.TechnologyType != null) ? true : updateAlways) {
            this$.TechnologyType = assay.TechnologyType;
        }
        if ((assay.TechnologyPlatform != null) ? true : updateAlways) {
            this$.TechnologyPlatform = assay.TechnologyPlatform;
        }
        if ((assay.Tables.length !== 0) ? true : updateAlways) {
            let s;
            const origin = this$.Tables;
            const next = assay.Tables;
            if (!appendSequences_1) {
                s = next;
            }
            else {
                let enumerator = getEnumerator(next);
                try {
                    while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                        const e = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
                        if (!contains(e, origin, {
                            Equals: equals,
                            GetHashCode: safeHash,
                        })) {
                            void (origin.push(e));
                        }
                    }
                }
                finally {
                    disposeSafe(enumerator);
                }
                s = origin;
            }
            this$.Tables = s;
        }
        if ((assay.Performers.length !== 0) ? true : updateAlways) {
            let s_1;
            const origin_1 = this$.Performers;
            const next_1 = assay.Performers;
            s_1 = (!appendSequences_1 ? next_1 : Array_distinct(append_8(origin_1, next_1), {
                Equals: equals,
                GetHashCode: safeHash,
            }));
            this$.Performers = s_1;
        }
        if ((assay.Comments.length !== 0) ? true : updateAlways) {
            let s_2;
            const origin_2 = this$.Comments;
            const next_2 = assay.Comments;
            s_2 = (!appendSequences_1 ? next_2 : Array_distinct(append_8(origin_2, next_2), {
                Equals: equals,
                GetHashCode: safeHash,
            }));
            this$.Comments = s_2;
        }
    }
    toString() {
        const this$ = this;
        const arg = this$.Identifier;
        const arg_1 = this$.MeasurementType;
        const arg_2 = this$.TechnologyType;
        const arg_3 = this$.TechnologyPlatform;
        const arg_4 = this$.Tables;
        const arg_5 = this$.Performers;
        const arg_6 = this$.Comments;
        return toText(printf("ArcAssay({\r\n    Identifier = \"%s\",\r\n    MeasurementType = %A,\r\n    TechnologyType = %A,\r\n    TechnologyPlatform = %A,\r\n    Tables = %A,\r\n    Performers = %A,\r\n    Comments = %A\r\n})"))(arg)(arg_1)(arg_2)(arg_3)(arg_4)(arg_5)(arg_6);
    }
    static composeTechnologyPlatform(tp) {
        const matchValue = tp.TANInfo;
        return (matchValue == null) ? (`${tp.NameText}`) : (`${tp.NameText} (${tp.TermAccessionShort})`);
    }
    static decomposeTechnologyPlatform(name) {
        const r = match(create("(?<value>[^\\(]+) \\((?<ontology>[^(]*:[^)]*)\\)"), name);
        if (r != null) {
            let oa;
            const arg = (r.groups && r.groups.ontology) || "";
            oa = OntologyAnnotation.fromTermAnnotation(arg);
            return new OntologyAnnotation(oa.ID, new AnnotationValue(0, [Value__get_Text(Value_fromString_Z721C83C5((r.groups && r.groups.value) || ""))]), oa.TermSourceREF, oa.TermAccessionNumber, oa.Comments);
        }
        else {
            return OntologyAnnotation.fromString(name);
        }
    }
    AddToInvestigation(investigation) {
        const this$ = this;
        this$.Investigation = investigation;
    }
    RemoveFromInvestigation() {
        const this$ = this;
        this$.Investigation = void 0;
    }
    UpdateReferenceByAssayFile(assay, onlyReplaceExisting) {
        const this$ = this;
        const updateAlways = !defaultArg(onlyReplaceExisting, false);
        if ((assay.MeasurementType != null) ? true : updateAlways) {
            this$.MeasurementType = assay.MeasurementType;
        }
        if ((assay.TechnologyPlatform != null) ? true : updateAlways) {
            this$.TechnologyPlatform = assay.TechnologyPlatform;
        }
        if ((assay.TechnologyType != null) ? true : updateAlways) {
            this$.TechnologyType = assay.TechnologyType;
        }
        if ((assay.Tables.length !== 0) ? true : updateAlways) {
            this$.Tables = assay.Tables;
        }
        if ((assay.Comments.length !== 0) ? true : updateAlways) {
            this$.Comments = assay.Comments;
        }
        if ((assay.Performers.length !== 0) ? true : updateAlways) {
            this$.Performers = assay.Performers;
        }
    }
    ToAssay() {
        const this$ = this;
        const processSeq = ArcTables__GetProcesses(ArcTables_$ctor_Z18C2F36D(this$.Tables));
        let assayMaterials;
        const v_2 = AssayMaterials_create_Z253F0553(unwrap(fromValueWithDefault(empty(), getSamples(processSeq))), unwrap(fromValueWithDefault(empty(), getMaterials(processSeq))));
        assayMaterials = fromValueWithDefault(AssayMaterials_get_empty(), v_2);
        return Assay_create_3D372A24(void 0, unwrap(isMissingIdentifier(this$.Identifier) ? void 0 : Assay_fileNameFromIdentifier(this$.Identifier)), unwrap(this$.MeasurementType), unwrap(this$.TechnologyType), unwrap(map_1((arg) => ArcAssay.composeTechnologyPlatform(arg), this$.TechnologyPlatform)), unwrap(fromValueWithDefault(empty(), getData(processSeq))), unwrap(assayMaterials), unwrap(fromValueWithDefault(empty(), getCharacteristics(processSeq))), unwrap(fromValueWithDefault(empty(), getUnits(processSeq))), unwrap(fromValueWithDefault(empty(), processSeq)), unwrap(fromValueWithDefault(empty(), ofArray(this$.Comments))));
    }
    static fromAssay(a) {
        const tables = map_1((arg_1) => ArcTables__get_Tables(ArcTables_fromProcesses_134EBDED(arg_1)), a.ProcessSequence);
        let identifer;
        const matchValue = a.FileName;
        identifer = ((matchValue == null) ? createMissingIdentifier() : Assay_identifierFromFileName(matchValue));
        return ArcAssay.create(identifer, unwrap(map_1((x) => x.Copy(), a.MeasurementType)), unwrap(map_1((x_1) => x_1.Copy(), a.TechnologyType)), unwrap(map_1((arg_2) => ArcAssay.decomposeTechnologyPlatform(arg_2), a.TechnologyPlatform)), unwrap(tables), void 0, unwrap(map_1(toArray, a.Comments)));
    }
}

export function ArcAssay_$reflection() {
    return class_type("ARCtrl.ISA.ArcAssay", void 0, ArcAssay);
}

export function ArcAssay_$ctor_Z1126B596(identifier, measurementType, technologyType, technologyPlatform, tables, performers, comments) {
    return new ArcAssay(identifier, measurementType, technologyType, technologyPlatform, tables, performers, comments);
}

export class ArcStudy {
    constructor(identifier, title, description, submissionDate, publicReleaseDate, publications, contacts, studyDesignDescriptors, tables, registeredAssayIdentifiers, factors, comments) {
        const publications_1 = defaultArg(publications, []);
        const contacts_1 = defaultArg(contacts, []);
        const studyDesignDescriptors_1 = defaultArg(studyDesignDescriptors, []);
        const tables_1 = defaultArg(tables, []);
        const registeredAssayIdentifiers_1 = defaultArg(registeredAssayIdentifiers, []);
        const factors_1 = defaultArg(factors, []);
        const comments_1 = defaultArg(comments, []);
        this["identifier@605"] = identifier;
        this.investigation = void 0;
        this["Title@"] = title;
        this["Description@"] = description;
        this["SubmissionDate@"] = submissionDate;
        this["PublicReleaseDate@"] = publicReleaseDate;
        this["Publications@"] = publications_1;
        this["Contacts@"] = contacts_1;
        this["StudyDesignDescriptors@"] = studyDesignDescriptors_1;
        this["Tables@"] = tables_1;
        this["RegisteredAssayIdentifiers@"] = registeredAssayIdentifiers_1;
        this["Factors@"] = factors_1;
        this["Comments@"] = comments_1;
    }
    get Identifier() {
        const this$ = this;
        return this$["identifier@605"];
    }
    set Identifier(i) {
        const this$ = this;
        this$["identifier@605"] = i;
    }
    get Investigation() {
        const this$ = this;
        return unwrap(this$.investigation);
    }
    set Investigation(i) {
        const this$ = this;
        this$.investigation = i;
    }
    get Title() {
        const __ = this;
        return unwrap(__["Title@"]);
    }
    set Title(v) {
        const __ = this;
        __["Title@"] = v;
    }
    get Description() {
        const __ = this;
        return unwrap(__["Description@"]);
    }
    set Description(v) {
        const __ = this;
        __["Description@"] = v;
    }
    get SubmissionDate() {
        const __ = this;
        return unwrap(__["SubmissionDate@"]);
    }
    set SubmissionDate(v) {
        const __ = this;
        __["SubmissionDate@"] = v;
    }
    get PublicReleaseDate() {
        const __ = this;
        return unwrap(__["PublicReleaseDate@"]);
    }
    set PublicReleaseDate(v) {
        const __ = this;
        __["PublicReleaseDate@"] = v;
    }
    get Publications() {
        const __ = this;
        return __["Publications@"];
    }
    set Publications(v) {
        const __ = this;
        __["Publications@"] = v;
    }
    get Contacts() {
        const __ = this;
        return __["Contacts@"];
    }
    set Contacts(v) {
        const __ = this;
        __["Contacts@"] = v;
    }
    get StudyDesignDescriptors() {
        const __ = this;
        return __["StudyDesignDescriptors@"];
    }
    set StudyDesignDescriptors(v) {
        const __ = this;
        __["StudyDesignDescriptors@"] = v;
    }
    get Tables() {
        const __ = this;
        return __["Tables@"];
    }
    set Tables(v) {
        const __ = this;
        __["Tables@"] = v;
    }
    get RegisteredAssayIdentifiers() {
        const __ = this;
        return __["RegisteredAssayIdentifiers@"];
    }
    set RegisteredAssayIdentifiers(v) {
        const __ = this;
        __["RegisteredAssayIdentifiers@"] = v;
    }
    get Factors() {
        const __ = this;
        return __["Factors@"];
    }
    set Factors(v) {
        const __ = this;
        __["Factors@"] = v;
    }
    get Comments() {
        const __ = this;
        return __["Comments@"];
    }
    set Comments(v) {
        const __ = this;
        __["Comments@"] = v;
    }
    static init(identifier) {
        return new ArcStudy(identifier);
    }
    static create(identifier, title, description, submissionDate, publicReleaseDate, publications, contacts, studyDesignDescriptors, tables, registeredAssayIdentifiers, factors, comments) {
        return new ArcStudy(identifier, unwrap(title), unwrap(description), unwrap(submissionDate), unwrap(publicReleaseDate), unwrap(publications), unwrap(contacts), unwrap(studyDesignDescriptors), unwrap(tables), unwrap(registeredAssayIdentifiers), unwrap(factors), unwrap(comments));
    }
    static make(identifier, title, description, submissionDate, publicReleaseDate, publications, contacts, studyDesignDescriptors, tables, registeredAssayIdentifiers, factors, comments) {
        return new ArcStudy(identifier, unwrap(title), unwrap(description), unwrap(submissionDate), unwrap(publicReleaseDate), publications, contacts, studyDesignDescriptors, tables, registeredAssayIdentifiers, factors, comments);
    }
    get isEmpty() {
        const this$ = this;
        return (((((((((equals(this$.Title, void 0) && equals(this$.Description, void 0)) && equals(this$.SubmissionDate, void 0)) && equals(this$.PublicReleaseDate, void 0)) && equalsWith(equals, this$.Publications, [])) && equalsWith(equals, this$.Contacts, [])) && equalsWith(equals, this$.StudyDesignDescriptors, [])) && (this$.Tables.length === 0)) && (this$.RegisteredAssayIdentifiers.length === 0)) && equalsWith(equals, this$.Factors, [])) && equalsWith(equals, this$.Comments, []);
    }
    static get FileName() {
        return "isa.study.xlsx";
    }
    get RegisteredAssayCount() {
        const this$ = this;
        return this$.RegisteredAssayIdentifiers.length | 0;
    }
    get RegisteredAssays() {
        const this$ = this;
        let inv;
        const investigation = this$.Investigation;
        if (investigation != null) {
            inv = investigation;
        }
        else {
            throw new Error("Cannot execute this function. Object is not part of ArcInvestigation.");
        }
        const assays = [];
        let enumerator = getEnumerator(inv.Assays);
        try {
            while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                const assay = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
                if (contains_1(assay.Identifier, this$.RegisteredAssayIdentifiers, {
                    Equals: (x, y) => (x === y),
                    GetHashCode: stringHash,
                })) {
                    void (assays.push(assay));
                }
            }
        }
        finally {
            disposeSafe(enumerator);
        }
        return assays;
    }
    AddRegisteredAssay(assay) {
        const this$ = this;
        let inv;
        const investigation = this$.Investigation;
        if (investigation != null) {
            inv = investigation;
        }
        else {
            throw new Error("Cannot execute this function. Object is not part of ArcInvestigation.");
        }
        inv.AddAssay(assay);
        inv.RegisterAssay(this$.Identifier, assay.Identifier);
    }
    static addRegisteredAssay(assay) {
        return (study) => {
            const newStudy = study.Copy();
            newStudy.AddRegisteredAssay(assay);
            return newStudy;
        };
    }
    InitRegisteredAssay(assayIdentifier) {
        const this$ = this;
        const assay = new ArcAssay(assayIdentifier);
        this$.AddRegisteredAssay(assay);
        return assay;
    }
    static initRegisteredAssay(assayIdentifier) {
        return (study) => {
            const copy = study.Copy();
            return [copy, copy.InitRegisteredAssay(assayIdentifier)];
        };
    }
    RegisterAssay(assayIdentifier) {
        const this$ = this;
        if (contains_1(assayIdentifier, this$.RegisteredAssayIdentifiers, {
            Equals: (x, y) => (x === y),
            GetHashCode: stringHash,
        })) {
            throw new Error(`Assay \`${assayIdentifier}\` is already registered on the study.`);
        }
        void (this$.RegisteredAssayIdentifiers.push(assayIdentifier));
    }
    static registerAssay(assayIdentifier) {
        return (study) => {
            const copy = study.Copy();
            copy.RegisterAssay(assayIdentifier);
            return copy;
        };
    }
    DeregisterAssay(assayIdentifier) {
        const this$ = this;
        removeInPlace(assayIdentifier, this$.RegisteredAssayIdentifiers, {
            Equals: (x, y) => (x === y),
            GetHashCode: stringHash,
        });
    }
    static deregisterAssay(assayIdentifier) {
        return (study) => {
            const copy = study.Copy();
            copy.DeregisterAssay(assayIdentifier);
            return copy;
        };
    }
    GetRegisteredAssay(assayIdentifier) {
        const this$ = this;
        if (!contains_1(assayIdentifier, this$.RegisteredAssayIdentifiers, {
            Equals: (x, y) => (x === y),
            GetHashCode: stringHash,
        })) {
            throw new Error(`Assay \`${assayIdentifier}\` is not registered on the study.`);
        }
        let inv;
        const investigation = this$.Investigation;
        if (investigation != null) {
            inv = investigation;
        }
        else {
            throw new Error("Cannot execute this function. Object is not part of ArcInvestigation.");
        }
        return inv.GetAssay(assayIdentifier);
    }
    static getRegisteredAssay(assayIdentifier) {
        return (study) => {
            const copy = study.Copy();
            return copy.GetRegisteredAssay(assayIdentifier);
        };
    }
    static getRegisteredAssays() {
        return (study) => {
            const copy = study.Copy();
            return copy.RegisteredAssays;
        };
    }
    GetRegisteredAssaysOrIdentifier() {
        const this$ = this;
        const matchValue = this$.Investigation;
        if (matchValue == null) {
            const arg = map_2((identifier) => ArcAssay.init(identifier), this$.RegisteredAssayIdentifiers);
            return Array.from(arg);
        }
        else {
            const i = matchValue;
            return this$.RegisteredAssays;
        }
    }
    static getRegisteredAssaysOrIdentifier() {
        return (study) => {
            const copy = study.Copy();
            return copy.GetRegisteredAssaysOrIdentifier();
        };
    }
    get TableCount() {
        const this$ = this;
        return ArcTables__get_Count(ArcTables_$ctor_Z18C2F36D(this$.Tables)) | 0;
    }
    get TableNames() {
        const this$ = this;
        return ArcTables__get_TableNames(ArcTables_$ctor_Z18C2F36D(this$.Tables));
    }
    AddTable(table, index) {
        const this$ = this;
        ArcTables__AddTable_EC12B15(ArcTables_$ctor_Z18C2F36D(this$.Tables), table, unwrap(index));
    }
    static addTable(table, index) {
        return (study) => {
            const c = study.Copy();
            c.AddTable(table, unwrap(index));
            return c;
        };
    }
    AddTables(tables, index) {
        const this$ = this;
        ArcTables__AddTables_Z2D453886(ArcTables_$ctor_Z18C2F36D(this$.Tables), tables, unwrap(index));
    }
    static addTables(tables, index) {
        return (study) => {
            const c = study.Copy();
            c.AddTables(tables, unwrap(index));
            return c;
        };
    }
    InitTable(tableName, index) {
        const this$ = this;
        return ArcTables__InitTable_3B406CA4(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, unwrap(index));
    }
    static initTable(tableName, index) {
        return (study) => {
            const c = study.Copy();
            return [c, c.InitTable(tableName, unwrap(index))];
        };
    }
    InitTables(tableNames, index) {
        const this$ = this;
        ArcTables__InitTables_7B28792B(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableNames, unwrap(index));
    }
    static initTables(tableNames, index) {
        return (study) => {
            const c = study.Copy();
            c.InitTables(tableNames, unwrap(index));
            return c;
        };
    }
    GetTableAt(index) {
        const this$ = this;
        return ArcTables__GetTableAt_Z524259A4(ArcTables_$ctor_Z18C2F36D(this$.Tables), index);
    }
    static getTableAt(index) {
        return (study) => {
            const newAssay = study.Copy();
            return newAssay.GetTableAt(index);
        };
    }
    GetTable(name) {
        const this$ = this;
        return ArcTables__GetTable_Z721C83C5(ArcTables_$ctor_Z18C2F36D(this$.Tables), name);
    }
    static getTable(name) {
        return (study) => {
            const newAssay = study.Copy();
            return newAssay.GetTable(name);
        };
    }
    UpdateTableAt(index, table) {
        const this$ = this;
        ArcTables__UpdateTableAt_7E571736(ArcTables_$ctor_Z18C2F36D(this$.Tables), index, table);
    }
    static updateTableAt(index, table) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.UpdateTableAt(index, table);
            return newAssay;
        };
    }
    UpdateTable(name, table) {
        const this$ = this;
        ArcTables__UpdateTable_51766571(ArcTables_$ctor_Z18C2F36D(this$.Tables), name, table);
    }
    static updateTable(name, table) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.UpdateTable(name, table);
            return newAssay;
        };
    }
    SetTableAt(index, table) {
        const this$ = this;
        ArcTables__SetTableAt_7E571736(ArcTables_$ctor_Z18C2F36D(this$.Tables), index, table);
    }
    static setTableAt(index, table) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.SetTableAt(index, table);
            return newAssay;
        };
    }
    SetTable(name, table) {
        const this$ = this;
        ArcTables__SetTable_51766571(ArcTables_$ctor_Z18C2F36D(this$.Tables), name, table);
    }
    static setTable(name, table) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.SetTable(name, table);
            return newAssay;
        };
    }
    RemoveTableAt(index) {
        const this$ = this;
        ArcTables__RemoveTableAt_Z524259A4(ArcTables_$ctor_Z18C2F36D(this$.Tables), index);
    }
    static removeTableAt(index) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.RemoveTableAt(index);
            return newAssay;
        };
    }
    RemoveTable(name) {
        const this$ = this;
        ArcTables__RemoveTable_Z721C83C5(ArcTables_$ctor_Z18C2F36D(this$.Tables), name);
    }
    static removeTable(name) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.RemoveTable(name);
            return newAssay;
        };
    }
    MapTableAt(index, updateFun) {
        const this$ = this;
        ArcTables__MapTableAt_8FC095C(ArcTables_$ctor_Z18C2F36D(this$.Tables), index, updateFun);
    }
    static mapTableAt(index, updateFun) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.MapTableAt(index, updateFun);
            return newAssay;
        };
    }
    MapTable(name, updateFun) {
        const this$ = this;
        ArcTables__MapTable_27DD7B1B(ArcTables_$ctor_Z18C2F36D(this$.Tables), name, updateFun);
    }
    static mapTable(name, updateFun) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.MapTable(name, updateFun);
            return newAssay;
        };
    }
    RenameTableAt(index, newName) {
        const this$ = this;
        ArcTables__RenameTableAt_Z176EF219(ArcTables_$ctor_Z18C2F36D(this$.Tables), index, newName);
    }
    static renameTableAt(index, newName) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.RenameTableAt(index, newName);
            return newAssay;
        };
    }
    RenameTable(name, newName) {
        const this$ = this;
        ArcTables__RenameTable_Z384F8060(ArcTables_$ctor_Z18C2F36D(this$.Tables), name, newName);
    }
    static renameTable(name, newName) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.RenameTable(name, newName);
            return newAssay;
        };
    }
    AddColumnAt(tableIndex, header, cells, columnIndex, forceReplace) {
        const this$ = this;
        ArcTables__AddColumnAt_6A9784DB(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableIndex, header, unwrap(cells), unwrap(columnIndex), unwrap(forceReplace));
    }
    static addColumnAt(tableIndex, header, cells, columnIndex, forceReplace) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.AddColumnAt(tableIndex, header, unwrap(cells), unwrap(columnIndex), unwrap(forceReplace));
            return newAssay;
        };
    }
    AddColumn(tableName, header, cells, columnIndex, forceReplace) {
        const this$ = this;
        ArcTables__AddColumn_1FF50D3C(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, header, unwrap(cells), unwrap(columnIndex), unwrap(forceReplace));
    }
    static addColumn(tableName, header, cells, columnIndex, forceReplace) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.AddColumn(tableName, header, unwrap(cells), unwrap(columnIndex), unwrap(forceReplace));
            return newAssay;
        };
    }
    RemoveColumnAt(tableIndex, columnIndex) {
        const this$ = this;
        ArcTables__RemoveColumnAt_Z37302880(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableIndex, columnIndex);
    }
    static removeColumnAt(tableIndex, columnIndex) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.RemoveColumnAt(tableIndex, columnIndex);
            return newAssay;
        };
    }
    RemoveColumn(tableName, columnIndex) {
        const this$ = this;
        ArcTables__RemoveColumn_Z18115A39(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, columnIndex);
    }
    static removeColumn(tableName, columnIndex) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.RemoveColumn(tableName, columnIndex);
            return newAssay;
        };
    }
    UpdateColumnAt(tableIndex, columnIndex, header, cells) {
        const this$ = this;
        ArcTables__UpdateColumnAt_21300791(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableIndex, columnIndex, header, unwrap(cells));
    }
    static updateColumnAt(tableIndex, columnIndex, header, cells) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.UpdateColumnAt(tableIndex, columnIndex, header, unwrap(cells));
            return newAssay;
        };
    }
    UpdateColumn(tableName, columnIndex, header, cells) {
        const this$ = this;
        ArcTables__UpdateColumn_Z6083042A(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, columnIndex, header, unwrap(cells));
    }
    static updateColumn(tableName, columnIndex, header, cells) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.UpdateColumn(tableName, columnIndex, header, unwrap(cells));
            return newAssay;
        };
    }
    GetColumnAt(tableIndex, columnIndex) {
        const this$ = this;
        return ArcTables__GetColumnAt_Z37302880(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableIndex, columnIndex);
    }
    static getColumnAt(tableIndex, columnIndex) {
        return (study) => {
            const newAssay = study.Copy();
            return newAssay.GetColumnAt(tableIndex, columnIndex);
        };
    }
    GetColumn(tableName, columnIndex) {
        const this$ = this;
        return ArcTables__GetColumn_Z18115A39(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, columnIndex);
    }
    static getColumn(tableName, columnIndex) {
        return (study) => {
            const newAssay = study.Copy();
            return newAssay.GetColumn(tableName, columnIndex);
        };
    }
    AddRowAt(tableIndex, cells, rowIndex) {
        const this$ = this;
        ArcTables__AddRowAt_Z12CDB784(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableIndex, unwrap(cells), unwrap(rowIndex));
    }
    static addRowAt(tableIndex, cells, rowIndex) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.AddRowAt(tableIndex, unwrap(cells), unwrap(rowIndex));
            return newAssay;
        };
    }
    AddRow(tableName, cells, rowIndex) {
        const this$ = this;
        ArcTables__AddRow_Z16315DE5(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, unwrap(cells), unwrap(rowIndex));
    }
    static addRow(tableName, cells, rowIndex) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.AddRow(tableName, unwrap(cells), unwrap(rowIndex));
            return newAssay;
        };
    }
    RemoveRowAt(tableIndex, rowIndex) {
        const this$ = this;
        ArcTables__RemoveRowAt_Z37302880(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableIndex, rowIndex);
    }
    static removeRowAt(tableIndex, rowIndex) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.RemoveColumnAt(tableIndex, rowIndex);
            return newAssay;
        };
    }
    RemoveRow(tableName, rowIndex) {
        const this$ = this;
        ArcTables__RemoveRow_Z18115A39(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, rowIndex);
    }
    static removeRow(tableName, rowIndex) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.RemoveRow(tableName, rowIndex);
            return newAssay;
        };
    }
    UpdateRowAt(tableIndex, rowIndex, cells) {
        const this$ = this;
        ArcTables__UpdateRowAt_1CF7B5DC(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableIndex, rowIndex, cells);
    }
    static updateRowAt(tableIndex, rowIndex, cells) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.UpdateRowAt(tableIndex, rowIndex, cells);
            return newAssay;
        };
    }
    UpdateRow(tableName, rowIndex, cells) {
        const this$ = this;
        ArcTables__UpdateRow_1BFE2CFB(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, rowIndex, cells);
    }
    static updateRow(tableName, rowIndex, cells) {
        return (study) => {
            const newAssay = study.Copy();
            newAssay.UpdateRow(tableName, rowIndex, cells);
            return newAssay;
        };
    }
    GetRowAt(tableIndex, rowIndex) {
        const this$ = this;
        return ArcTables__GetRowAt_Z37302880(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableIndex, rowIndex);
    }
    static getRowAt(tableIndex, rowIndex) {
        return (study) => {
            const newAssay = study.Copy();
            return newAssay.GetRowAt(tableIndex, rowIndex);
        };
    }
    GetRow(tableName, rowIndex) {
        const this$ = this;
        return ArcTables__GetRow_Z18115A39(ArcTables_$ctor_Z18C2F36D(this$.Tables), tableName, rowIndex);
    }
    static getRow(tableName, rowIndex) {
        return (study) => {
            const newAssay = study.Copy();
            return newAssay.GetRow(tableName, rowIndex);
        };
    }
    AddToInvestigation(investigation) {
        const this$ = this;
        this$.Investigation = investigation;
    }
    RemoveFromInvestigation() {
        const this$ = this;
        this$.Investigation = void 0;
    }
    Copy() {
        const this$ = this;
        const nextTables = [];
        const nextAssayIdentifiers = Array.from(this$.RegisteredAssayIdentifiers);
        let enumerator = getEnumerator(this$.Tables);
        try {
            while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                const table = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
                const copy = table.Copy();
                void (nextTables.push(copy));
            }
        }
        finally {
            disposeSafe(enumerator);
        }
        const nextComments = map((c) => c.Copy(), this$.Comments);
        const nextFactors = map((c_1) => c_1.Copy(), this$.Factors);
        const nextContacts = map((c_2) => c_2.Copy(), this$.Contacts);
        const nextPublications = map((c_3) => c_3.Copy(), this$.Publications);
        const nextStudyDesignDescriptors = map((c_4) => c_4.Copy(), this$.StudyDesignDescriptors);
        return new ArcStudy(this$.Identifier, unwrap(this$.Title), unwrap(this$.Description), unwrap(this$.SubmissionDate), unwrap(this$.PublicReleaseDate), nextPublications, nextContacts, nextStudyDesignDescriptors, nextTables, nextAssayIdentifiers, nextFactors, nextComments);
    }
    UpdateReferenceByStudyFile(study, onlyReplaceExisting) {
        let source_1;
        const this$ = this;
        const updateAlways = !defaultArg(onlyReplaceExisting, false);
        if ((study.Title != null) ? true : updateAlways) {
            this$.Title = study.Title;
        }
        if ((study.Description != null) ? true : updateAlways) {
            this$.Description = study.Description;
        }
        if ((study.SubmissionDate != null) ? true : updateAlways) {
            this$.SubmissionDate = study.SubmissionDate;
        }
        if ((study.PublicReleaseDate != null) ? true : updateAlways) {
            this$.PublicReleaseDate = study.PublicReleaseDate;
        }
        if ((study.Publications.length !== 0) ? true : updateAlways) {
            this$.Publications = study.Publications;
        }
        if ((study.Contacts.length !== 0) ? true : updateAlways) {
            this$.Contacts = study.Contacts;
        }
        if ((study.StudyDesignDescriptors.length !== 0) ? true : updateAlways) {
            this$.StudyDesignDescriptors = study.StudyDesignDescriptors;
        }
        if ((study.Tables.length !== 0) ? true : updateAlways) {
            let s;
            const arg = map_2((tupledArg) => {
                const ts = tupledArg[1];
                if (length(ts) === 2) {
                    item(0, ts).UpdateReferenceByAnnotationTable(item(1, ts));
                    return head(ts);
                }
                else {
                    return head(ts);
                }
            }, groupBy((t) => t.Name, (source_1 = study.Tables, append_9(this$.Tables, source_1)), {
                Equals: (x, y) => (x === y),
                GetHashCode: stringHash,
            }));
            s = Array.from(arg);
            this$.Tables = s;
        }
        if ((study.RegisteredAssayIdentifiers.length !== 0) ? true : updateAlways) {
            this$.RegisteredAssayIdentifiers = study.RegisteredAssayIdentifiers;
        }
        if ((study.Factors.length !== 0) ? true : updateAlways) {
            this$.Factors = study.Factors;
        }
        if ((study.Comments.length !== 0) ? true : updateAlways) {
            this$.Comments = study.Comments;
        }
    }
    ToStudy(arcAssays) {
        const this$ = this;
        const processSeq = ArcTables__GetProcesses(ArcTables_$ctor_Z18C2F36D(this$.Tables));
        const protocols = fromValueWithDefault(empty(), getProtocols(processSeq));
        let studyMaterials;
        const v_4 = StudyMaterials_create_1BE9FA55(unwrap(fromValueWithDefault(empty(), getSources(processSeq))), unwrap(fromValueWithDefault(empty(), getSamples(processSeq))), unwrap(fromValueWithDefault(empty(), getMaterials(processSeq))));
        studyMaterials = fromValueWithDefault(StudyMaterials_get_empty(), v_4);
        const patternInput = isMissingIdentifier(this$.Identifier) ? [void 0, void 0] : [this$.Identifier, Study_fileNameFromIdentifier(this$.Identifier)];
        const assays = map_3((a) => a.ToAssay(), ofSeq(defaultArg(arcAssays, this$.GetRegisteredAssaysOrIdentifier())));
        return Study_create_Z2D28E954(void 0, unwrap(patternInput[1]), unwrap(patternInput[0]), unwrap(this$.Title), unwrap(this$.Description), unwrap(this$.SubmissionDate), unwrap(this$.PublicReleaseDate), unwrap(fromValueWithDefault(empty(), ofArray(this$.Publications))), unwrap(fromValueWithDefault(empty(), ofArray(this$.Contacts))), unwrap(fromValueWithDefault(empty(), ofArray(this$.StudyDesignDescriptors))), unwrap(protocols), unwrap(studyMaterials), unwrap(fromValueWithDefault(empty(), processSeq)), unwrap(fromValueWithDefault(empty(), assays)), unwrap(fromValueWithDefault(empty(), ofArray(this$.Factors))), unwrap(fromValueWithDefault(empty(), getCharacteristics(processSeq))), unwrap(fromValueWithDefault(empty(), getUnits(processSeq))), unwrap(fromValueWithDefault(empty(), ofArray(this$.Comments))));
    }
    static fromStudy(s) {
        const tables = map_1((arg_1) => ArcTables__get_Tables(ArcTables_fromProcesses_134EBDED(arg_1)), s.ProcessSequence);
        let identifer;
        const matchValue = s.FileName;
        identifer = ((matchValue == null) ? createMissingIdentifier() : Study_identifierFromFileName(matchValue));
        const assays = defaultArg(map_1((arg_4) => {
            const arg_3 = map_3((arg_2) => ArcAssay.fromAssay(arg_2), arg_4);
            return Array.from(arg_3);
        }, s.Assays), []);
        let assaysIdentifiers;
        const arg_5 = map_2((a) => a.Identifier, assays);
        assaysIdentifiers = Array.from(arg_5);
        return [ArcStudy.create(identifer, unwrap(s.Title), unwrap(s.Description), unwrap(s.SubmissionDate), unwrap(s.PublicReleaseDate), unwrap(map_1(toArray, s.Publications)), unwrap(map_1(toArray, s.Contacts)), unwrap(map_1(toArray, s.StudyDesignDescriptors)), unwrap(tables), assaysIdentifiers, unwrap(map_1(toArray, s.Factors)), unwrap(map_1(toArray, s.Comments))), assays];
    }
}

export function ArcStudy_$reflection() {
    return class_type("ARCtrl.ISA.ArcStudy", void 0, ArcStudy);
}

export function ArcStudy_$ctor_Z4F2D842F(identifier, title, description, submissionDate, publicReleaseDate, publications, contacts, studyDesignDescriptors, tables, registeredAssayIdentifiers, factors, comments) {
    return new ArcStudy(identifier, title, description, submissionDate, publicReleaseDate, publications, contacts, studyDesignDescriptors, tables, registeredAssayIdentifiers, factors, comments);
}

export class ArcInvestigation {
    constructor(identifier, title, description, submissionDate, publicReleaseDate, ontologySourceReferences, publications, contacts, assays, studies, registeredStudyIdentifiers, comments, remarks) {
        const this$ = new FSharpRef(defaultOf());
        this$.contents = this;
        const ontologySourceReferences_1 = defaultArg(ontologySourceReferences, []);
        const publications_1 = defaultArg(publications, []);
        const contacts_1 = defaultArg(contacts, []);
        let assays_1;
        const ass = defaultArg(assays, []);
        let enumerator = getEnumerator(ass);
        try {
            while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                const a = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
                a.Investigation = this$.contents;
            }
        }
        finally {
            disposeSafe(enumerator);
        }
        assays_1 = ass;
        let studies_1;
        const sss = defaultArg(studies, []);
        let enumerator_1 = getEnumerator(sss);
        try {
            while (enumerator_1["System.Collections.IEnumerator.MoveNext"]()) {
                const s = enumerator_1["System.Collections.Generic.IEnumerator`1.get_Current"]();
                s.Investigation = this$.contents;
            }
        }
        finally {
            disposeSafe(enumerator_1);
        }
        studies_1 = sss;
        const registeredStudyIdentifiers_1 = defaultArg(registeredStudyIdentifiers, []);
        const comments_1 = defaultArg(comments, []);
        const remarks_1 = defaultArg(remarks, []);
        this["identifier@1237"] = identifier;
        this["Title@"] = title;
        this["Description@"] = description;
        this["SubmissionDate@"] = submissionDate;
        this["PublicReleaseDate@"] = publicReleaseDate;
        this["OntologySourceReferences@"] = ontologySourceReferences_1;
        this["Publications@"] = publications_1;
        this["Contacts@"] = contacts_1;
        this["Assays@"] = assays_1;
        this["Studies@"] = studies_1;
        this["RegisteredStudyIdentifiers@"] = registeredStudyIdentifiers_1;
        this["Comments@"] = comments_1;
        this["Remarks@"] = remarks_1;
        this["init@1218"] = 1;
    }
    get Identifier() {
        const this$ = this;
        return this$["identifier@1237"];
    }
    set Identifier(i) {
        const this$ = this;
        this$["identifier@1237"] = i;
    }
    get Title() {
        const __ = this;
        return unwrap(__["Title@"]);
    }
    set Title(v) {
        const __ = this;
        __["Title@"] = v;
    }
    get Description() {
        const __ = this;
        return unwrap(__["Description@"]);
    }
    set Description(v) {
        const __ = this;
        __["Description@"] = v;
    }
    get SubmissionDate() {
        const __ = this;
        return unwrap(__["SubmissionDate@"]);
    }
    set SubmissionDate(v) {
        const __ = this;
        __["SubmissionDate@"] = v;
    }
    get PublicReleaseDate() {
        const __ = this;
        return unwrap(__["PublicReleaseDate@"]);
    }
    set PublicReleaseDate(v) {
        const __ = this;
        __["PublicReleaseDate@"] = v;
    }
    get OntologySourceReferences() {
        const __ = this;
        return __["OntologySourceReferences@"];
    }
    set OntologySourceReferences(v) {
        const __ = this;
        __["OntologySourceReferences@"] = v;
    }
    get Publications() {
        const __ = this;
        return __["Publications@"];
    }
    set Publications(v) {
        const __ = this;
        __["Publications@"] = v;
    }
    get Contacts() {
        const __ = this;
        return __["Contacts@"];
    }
    set Contacts(v) {
        const __ = this;
        __["Contacts@"] = v;
    }
    get Assays() {
        const __ = this;
        return __["Assays@"];
    }
    set Assays(v) {
        const __ = this;
        __["Assays@"] = v;
    }
    get Studies() {
        const __ = this;
        return __["Studies@"];
    }
    set Studies(v) {
        const __ = this;
        __["Studies@"] = v;
    }
    get RegisteredStudyIdentifiers() {
        const __ = this;
        return __["RegisteredStudyIdentifiers@"];
    }
    set RegisteredStudyIdentifiers(v) {
        const __ = this;
        __["RegisteredStudyIdentifiers@"] = v;
    }
    get Comments() {
        const __ = this;
        return __["Comments@"];
    }
    set Comments(v) {
        const __ = this;
        __["Comments@"] = v;
    }
    get Remarks() {
        const __ = this;
        return __["Remarks@"];
    }
    set Remarks(v) {
        const __ = this;
        __["Remarks@"] = v;
    }
    static get FileName() {
        return "isa.investigation.xlsx";
    }
    static init(identifier) {
        return new ArcInvestigation(identifier);
    }
    static create(identifier, title, description, submissionDate, publicReleaseDate, ontologySourceReferences, publications, contacts, assays, studies, registeredStudyIdentifiers, comments, remarks) {
        return new ArcInvestigation(identifier, unwrap(title), unwrap(description), unwrap(submissionDate), unwrap(publicReleaseDate), unwrap(ontologySourceReferences), unwrap(publications), unwrap(contacts), unwrap(assays), unwrap(studies), unwrap(registeredStudyIdentifiers), unwrap(comments), unwrap(remarks));
    }
    static make(identifier, title, description, submissionDate, publicReleaseDate, ontologySourceReferences, publications, contacts, assays, studies, registeredStudyIdentifiers, comments, remarks) {
        return new ArcInvestigation(identifier, unwrap(title), unwrap(description), unwrap(submissionDate), unwrap(publicReleaseDate), ontologySourceReferences, publications, contacts, assays, studies, registeredStudyIdentifiers, comments, remarks);
    }
    get AssayCount() {
        const this$ = this;
        return this$.Assays.length | 0;
    }
    get AssayIdentifiers() {
        const this$ = this;
        return Array.from(map_2((x) => x.Identifier, this$.Assays));
    }
    AddAssay(assay) {
        const this$ = this;
        const assayIdent = assay.Identifier;
        const matchValue = tryFindIndex((x_1) => (x_1 === assayIdent), map_2((x) => x.Identifier, this$.Assays));
        if (matchValue == null) {
        }
        else {
            throw new Error(`Cannot create assay with name ${assayIdent}, as assay names must be unique and assay at index ${matchValue} has the same name.`);
        }
        assay.Investigation = this$;
        void (this$.Assays.push(assay));
    }
    static addAssay(assay) {
        return (inv) => {
            const newInvestigation = inv.Copy();
            newInvestigation.AddAssay(assay);
            return newInvestigation;
        };
    }
    InitAssay(assayIdentifier) {
        const this$ = this;
        const assay = new ArcAssay(assayIdentifier);
        this$.AddAssay(assay);
        return assay;
    }
    static initAssay(assayIdentifier) {
        return (inv) => {
            const newInvestigation = inv.Copy();
            return newInvestigation.InitAssay(assayIdentifier);
        };
    }
    RemoveAssayAt(index) {
        const this$ = this;
        this$.Assays.splice(index, 1);
        this$.DeregisterMissingAssays();
    }
    static removeAssayAt(index) {
        return (inv) => {
            const newInvestigation = inv.Copy();
            newInvestigation.RemoveAssayAt(index);
            return newInvestigation;
        };
    }
    RemoveAssay(assayIdentifier) {
        const this$ = this;
        const index = this$.GetAssayIndex(assayIdentifier) | 0;
        this$.RemoveAssayAt(index);
    }
    static removeAssay(assayIdentifier) {
        return (inv) => {
            const newInv = inv.Copy();
            newInv.RemoveAssay(assayIdentifier);
            return newInv;
        };
    }
    SetAssayAt(index, assay) {
        const this$ = this;
        const assayIdent = assay.Identifier;
        const matchValue = tryFindIndex((x) => (x === assayIdent), map_2((a) => a.Identifier, removeAt(index, this$.Assays)));
        if (matchValue == null) {
        }
        else {
            throw new Error(`Cannot create assay with name ${assayIdent}, as assay names must be unique and assay at index ${matchValue} has the same name.`);
        }
        assay.Investigation = this$;
        this$.Assays[index] = assay;
        this$.DeregisterMissingAssays();
    }
    static setAssayAt(index, assay) {
        return (inv) => {
            const newInvestigation = inv.Copy();
            newInvestigation.SetAssayAt(index, assay);
            return newInvestigation;
        };
    }
    SetAssay(assayIdentifier, assay) {
        const this$ = this;
        const index = this$.GetAssayIndex(assayIdentifier) | 0;
        this$.SetAssayAt(index, assay);
    }
    static setAssay(assayIdentifier, assay) {
        return (inv) => {
            const newInvestigation = inv.Copy();
            newInvestigation.SetAssay(assayIdentifier, assay);
            return newInvestigation;
        };
    }
    GetAssayIndex(assayIdentifier) {
        const this$ = this;
        const index = this$.Assays.findIndex((a) => (a.Identifier === assayIdentifier)) | 0;
        if (index === -1) {
            throw new Error(`Unable to find assay with specified identifier '${assayIdentifier}'!`);
        }
        return index | 0;
    }
    static getAssayIndex(assayIdentifier) {
        return (inv) => inv.GetAssayIndex(assayIdentifier);
    }
    GetAssayAt(index) {
        const this$ = this;
        return this$.Assays[index];
    }
    static getAssayAt(index) {
        return (inv) => {
            const newInvestigation = inv.Copy();
            return newInvestigation.GetAssayAt(index);
        };
    }
    GetAssay(assayIdentifier) {
        const this$ = this;
        const index = this$.GetAssayIndex(assayIdentifier) | 0;
        return this$.GetAssayAt(index);
    }
    static getAssay(assayIdentifier) {
        return (inv) => {
            const newInvestigation = inv.Copy();
            return newInvestigation.GetAssay(assayIdentifier);
        };
    }
    get RegisteredStudies() {
        const this$ = this;
        const arg = map_2((identifier) => this$.GetStudy(identifier), this$.RegisteredStudyIdentifiers);
        return Array.from(arg);
    }
    get StudyCount() {
        const this$ = this;
        return this$.Studies.length | 0;
    }
    get StudyIdentifiers() {
        const this$ = this;
        return map_2((x) => x.Identifier, this$.Studies);
    }
    AddStudy(study) {
        const this$ = this;
        const study_1 = study;
        const matchValue = tryFindIndex((x) => (x.Identifier === study_1.Identifier), this$.Studies);
        if (matchValue == null) {
        }
        else {
            throw new Error(`Cannot create study with name ${study_1.Identifier}, as study names must be unique and study at index ${matchValue} has the same name.`);
        }
        study.Investigation = this$;
        void (this$.Studies.push(study));
    }
    static addStudy(study) {
        return (inv) => {
            const copy = inv.Copy();
            copy.AddStudy(study);
            return copy;
        };
    }
    InitStudy(studyIdentifier) {
        const this$ = this;
        const study = ArcStudy.init(studyIdentifier);
        this$.AddStudy(study);
        return study;
    }
    static initStudy(studyIdentifier) {
        return (inv) => {
            const copy = inv.Copy();
            return [copy, copy.InitStudy(studyIdentifier)];
        };
    }
    RegisterStudy(studyIdentifier) {
        const this$ = this;
        const studyIdent = studyIdentifier;
        const matchValue = tryFind((x) => (x === studyIdent), this$.StudyIdentifiers);
        if (matchValue != null) {
        }
        else {
            throw new Error(`The given study with identifier '${studyIdent}' must be added to Investigation before it can be registered.`);
        }
        const studyIdent_1 = studyIdentifier;
        if (contains_1(studyIdent_1, this$.RegisteredStudyIdentifiers, {
            Equals: (x_1, y) => (x_1 === y),
            GetHashCode: stringHash,
        })) {
            throw new Error(`Study with identifier '${studyIdent_1}' is already registered!`);
        }
        void (this$.RegisteredStudyIdentifiers.push(studyIdentifier));
    }
    static registerStudy(studyIdentifier) {
        return (inv) => {
            const copy = inv.Copy();
            copy.RegisterStudy(studyIdentifier);
            return copy;
        };
    }
    AddRegisteredStudy(study) {
        const this$ = this;
        this$.AddStudy(study);
        this$.RegisterStudy(study.Identifier);
    }
    static addRegisteredStudy(study) {
        return (inv) => {
            const copy = inv.Copy();
            const study_1 = study.Copy();
            copy.AddRegisteredStudy(study_1);
            return copy;
        };
    }
    RemoveStudyAt(index) {
        const this$ = this;
        this$.Studies.splice(index, 1);
    }
    static removeStudyAt(index) {
        return (inv) => {
            const newInv = inv.Copy();
            newInv.RemoveStudyAt(index);
            return newInv;
        };
    }
    RemoveStudy(studyIdentifier) {
        const this$ = this;
        removeInPlace(this$.GetStudy(studyIdentifier), this$.Studies, {
            Equals: equals,
            GetHashCode: safeHash,
        });
    }
    static removeStudy(studyIdentifier) {
        return (inv) => {
            const copy = inv.Copy();
            copy.RemoveStudy(studyIdentifier);
            return copy;
        };
    }
    SetStudyAt(index, study) {
        const this$ = this;
        const study_1 = study;
        const matchValue = tryFindIndex((x) => (x.Identifier === study_1.Identifier), removeAt(index, this$.Studies));
        if (matchValue == null) {
        }
        else {
            throw new Error(`Cannot create study with name ${study_1.Identifier}, as study names must be unique and study at index ${matchValue} has the same name.`);
        }
        study.Investigation = this$;
        this$.Studies[index] = study;
    }
    static setStudyAt(index, study) {
        return (inv) => {
            const newInv = inv.Copy();
            newInv.SetStudyAt(index, study);
            return newInv;
        };
    }
    SetStudy(studyIdentifier, study) {
        const this$ = this;
        const index = this$.GetStudyIndex(studyIdentifier) | 0;
        this$.SetStudyAt(index, study);
    }
    static setStudy(studyIdentifier, study) {
        return (inv) => {
            const newInv = inv.Copy();
            newInv.SetStudy(studyIdentifier, study);
            return newInv;
        };
    }
    GetStudyIndex(studyIdentifier) {
        const this$ = this;
        const index = this$.Studies.findIndex((s) => (s.Identifier === studyIdentifier)) | 0;
        if (index === -1) {
            throw new Error(`Unable to find study with specified identifier '${studyIdentifier}'!`);
        }
        return index | 0;
    }
    static getStudyIndex(studyIdentifier) {
        return (inv) => inv.GetStudyIndex(studyIdentifier);
    }
    GetStudyAt(index) {
        const this$ = this;
        return this$.Studies[index];
    }
    static getStudyAt(index) {
        return (inv) => {
            const newInv = inv.Copy();
            return newInv.GetStudyAt(index);
        };
    }
    GetStudy(studyIdentifier) {
        const this$ = this;
        return defaultArg(tryFind_1((s) => (s.Identifier === studyIdentifier), this$.Studies), defaultOf());
    }
    static getStudy(studyIdentifier) {
        return (inv) => {
            const newInv = inv.Copy();
            return newInv.GetStudy(studyIdentifier);
        };
    }
    RegisterAssayAt(studyIndex, assayIdentifier) {
        const this$ = this;
        const study = this$.GetStudyAt(studyIndex);
        const matchValue = tryFind((x) => (x === assayIdentifier), map_2((a) => a.Identifier, this$.Assays));
        if (matchValue != null) {
        }
        else {
            throw new Error("The given assay must be added to Investigation before it can be registered.");
        }
        const assayIdent_1 = assayIdentifier;
        const matchValue_1 = tryFindIndex((x_1) => (x_1 === assayIdent_1), study.RegisteredAssayIdentifiers);
        if (matchValue_1 == null) {
        }
        else {
            throw new Error(`Cannot create assay with name ${assayIdent_1}, as assay names must be unique and assay at index ${matchValue_1} has the same name.`);
        }
        study.RegisterAssay(assayIdentifier);
    }
    static registerAssayAt(studyIndex, assayIdentifier) {
        return (inv) => {
            const copy = inv.Copy();
            copy.RegisterAssayAt(studyIndex, assayIdentifier);
            return copy;
        };
    }
    RegisterAssay(studyIdentifier, assayIdentifier) {
        const this$ = this;
        const index = this$.GetStudyIndex(studyIdentifier) | 0;
        this$.RegisterAssayAt(index, assayIdentifier);
    }
    static registerAssay(studyIdentifier, assayIdentifier) {
        return (inv) => {
            const copy = inv.Copy();
            copy.RegisterAssay(studyIdentifier, assayIdentifier);
            return copy;
        };
    }
    DeregisterAssayAt(studyIndex, assayIdentifier) {
        const this$ = this;
        const study = this$.GetStudyAt(studyIndex);
        study.DeregisterAssay(assayIdentifier);
    }
    static deregisterAssayAt(studyIndex, assayIdentifier) {
        return (inv) => {
            const copy = inv.Copy();
            copy.DeregisterAssayAt(studyIndex, assayIdentifier);
            return copy;
        };
    }
    DeregisterAssay(studyIdentifier, assayIdentifier) {
        const this$ = this;
        const index = this$.GetStudyIndex(studyIdentifier) | 0;
        this$.DeregisterAssayAt(index, assayIdentifier);
    }
    static deregisterAssay(studyIdentifier, assayIdentifier) {
        return (inv) => {
            const copy = inv.Copy();
            copy.DeregisterAssay(studyIdentifier, assayIdentifier);
            return copy;
        };
    }
    DeregisterMissingAssays() {
        const this$ = this;
        const inv = this$;
        const existingAssays = inv.AssayIdentifiers;
        let enumerator = getEnumerator(inv.Studies);
        try {
            while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                const study = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
                let enumerator_1 = getEnumerator(Array.from(study.RegisteredAssayIdentifiers));
                try {
                    while (enumerator_1["System.Collections.IEnumerator.MoveNext"]()) {
                        const registeredAssay = enumerator_1["System.Collections.Generic.IEnumerator`1.get_Current"]();
                        if (!contains_1(registeredAssay, existingAssays, {
                            Equals: (x, y) => (x === y),
                            GetHashCode: stringHash,
                        })) {
                            const value_1 = study.DeregisterAssay(registeredAssay);
                        }
                    }
                }
                finally {
                    disposeSafe(enumerator_1);
                }
            }
        }
        finally {
            disposeSafe(enumerator);
        }
    }
    static deregisterMissingAssays() {
        return (inv) => {
            const copy = inv.Copy();
            copy.DeregisterMissingAssays();
            return copy;
        };
    }
    Copy() {
        const this$ = this;
        const nextAssays = [];
        const nextStudies = [];
        let enumerator = getEnumerator(this$.Assays);
        try {
            while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                const assay = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
                const copy = assay.Copy();
                void (nextAssays.push(copy));
            }
        }
        finally {
            disposeSafe(enumerator);
        }
        let enumerator_1 = getEnumerator(this$.Studies);
        try {
            while (enumerator_1["System.Collections.IEnumerator.MoveNext"]()) {
                const study = enumerator_1["System.Collections.Generic.IEnumerator`1.get_Current"]();
                const copy_1 = study.Copy();
                void (nextStudies.push(copy_1));
            }
        }
        finally {
            disposeSafe(enumerator_1);
        }
        const nextComments = map((c) => c.Copy(), this$.Comments);
        const nextRemarks = map((c_1) => c_1.Copy(), this$.Remarks);
        const nextContacts = map((c_2) => c_2.Copy(), this$.Contacts);
        const nextPublications = map((c_3) => c_3.Copy(), this$.Publications);
        const nextOntologySourceReferences = map((c_4) => c_4.Copy(), this$.OntologySourceReferences);
        const nextStudyIdentifiers = Array.from(this$.RegisteredStudyIdentifiers);
        return new ArcInvestigation(this$.Identifier, unwrap(this$.Title), unwrap(this$.Description), unwrap(this$.SubmissionDate), unwrap(this$.PublicReleaseDate), nextOntologySourceReferences, nextPublications, nextContacts, nextAssays, nextStudies, nextStudyIdentifiers, nextComments, nextRemarks);
    }
    UpdateBy(inv, onlyReplaceExisting, appendSequences) {
        const this$ = this;
        const onlyReplaceExisting_1 = defaultArg(onlyReplaceExisting, false);
        const appendSequences_1 = defaultArg(appendSequences, false);
        const updateAlways = !onlyReplaceExisting_1;
        if ((inv.Title != null) ? true : updateAlways) {
            this$.Title = inv.Title;
        }
        if ((inv.Description != null) ? true : updateAlways) {
            this$.Description = inv.Description;
        }
        if ((inv.SubmissionDate != null) ? true : updateAlways) {
            this$.SubmissionDate = inv.SubmissionDate;
        }
        if ((inv.PublicReleaseDate != null) ? true : updateAlways) {
            this$.PublicReleaseDate = inv.PublicReleaseDate;
        }
        if ((inv.OntologySourceReferences.length !== 0) ? true : updateAlways) {
            let s;
            const origin = this$.OntologySourceReferences;
            const next = inv.OntologySourceReferences;
            s = (!appendSequences_1 ? next : Array_distinct(append_8(origin, next), {
                Equals: equals,
                GetHashCode: safeHash,
            }));
            this$.OntologySourceReferences = s;
        }
        if ((inv.Publications.length !== 0) ? true : updateAlways) {
            let s_1;
            const origin_1 = this$.Publications;
            const next_1 = inv.Publications;
            s_1 = (!appendSequences_1 ? next_1 : Array_distinct(append_8(origin_1, next_1), {
                Equals: equals,
                GetHashCode: safeHash,
            }));
            this$.Publications = s_1;
        }
        if ((inv.Contacts.length !== 0) ? true : updateAlways) {
            let s_2;
            const origin_2 = this$.Contacts;
            const next_2 = inv.Contacts;
            s_2 = (!appendSequences_1 ? next_2 : Array_distinct(append_8(origin_2, next_2), {
                Equals: equals,
                GetHashCode: safeHash,
            }));
            this$.Contacts = s_2;
        }
        if ((inv.Assays.length !== 0) ? true : updateAlways) {
            let s_3;
            const origin_3 = this$.Assays;
            const next_3 = inv.Assays;
            if (!appendSequences_1) {
                s_3 = next_3;
            }
            else {
                let enumerator = getEnumerator(next_3);
                try {
                    while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                        const e = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
                        if (!contains(e, origin_3, {
                            Equals: equals,
                            GetHashCode: safeHash,
                        })) {
                            void (origin_3.push(e));
                        }
                    }
                }
                finally {
                    disposeSafe(enumerator);
                }
                s_3 = origin_3;
            }
            this$.Assays = s_3;
        }
        if ((inv.Studies.length !== 0) ? true : updateAlways) {
            let s_4;
            const origin_4 = this$.Studies;
            const next_4 = inv.Studies;
            if (!appendSequences_1) {
                s_4 = next_4;
            }
            else {
                let enumerator_1 = getEnumerator(next_4);
                try {
                    while (enumerator_1["System.Collections.IEnumerator.MoveNext"]()) {
                        const e_1 = enumerator_1["System.Collections.Generic.IEnumerator`1.get_Current"]();
                        if (!contains(e_1, origin_4, {
                            Equals: equals,
                            GetHashCode: safeHash,
                        })) {
                            void (origin_4.push(e_1));
                        }
                    }
                }
                finally {
                    disposeSafe(enumerator_1);
                }
                s_4 = origin_4;
            }
            this$.Studies = s_4;
        }
        if ((inv.RegisteredStudyIdentifiers.length !== 0) ? true : updateAlways) {
            let s_5;
            const origin_5 = this$.RegisteredStudyIdentifiers;
            const next_5 = inv.RegisteredStudyIdentifiers;
            if (!appendSequences_1) {
                s_5 = next_5;
            }
            else {
                let enumerator_2 = getEnumerator(next_5);
                try {
                    while (enumerator_2["System.Collections.IEnumerator.MoveNext"]()) {
                        const e_2 = enumerator_2["System.Collections.Generic.IEnumerator`1.get_Current"]();
                        if (!contains(e_2, origin_5, {
                            Equals: (x_5, y_5) => (x_5 === y_5),
                            GetHashCode: stringHash,
                        })) {
                            void (origin_5.push(e_2));
                        }
                    }
                }
                finally {
                    disposeSafe(enumerator_2);
                }
                s_5 = origin_5;
            }
            this$.RegisteredStudyIdentifiers = s_5;
        }
        if ((inv.Comments.length !== 0) ? true : updateAlways) {
            let s_6;
            const origin_6 = this$.Comments;
            const next_6 = inv.Comments;
            s_6 = (!appendSequences_1 ? next_6 : Array_distinct(append_8(origin_6, next_6), {
                Equals: equals,
                GetHashCode: safeHash,
            }));
            this$.Comments = s_6;
        }
        if ((inv.Remarks.length !== 0) ? true : updateAlways) {
            let s_7;
            const origin_7 = this$.Remarks;
            const next_7 = inv.Remarks;
            s_7 = (!appendSequences_1 ? next_7 : Array_distinct(append_8(origin_7, next_7), {
                Equals: equals,
                GetHashCode: safeHash,
            }));
            this$.Remarks = s_7;
        }
    }
    ToInvestigation() {
        const this$ = this;
        const studies = fromValueWithDefault(empty(), map_3((a) => a.ToStudy(), toList(this$.RegisteredStudies)));
        return Investigation_create_4AD66BBE(void 0, "isa.investigation.xlsx", isMissingIdentifier(this$.Identifier) ? void 0 : this$.Identifier, this$.Title, this$.Description, this$.SubmissionDate, this$.PublicReleaseDate, void 0, fromValueWithDefault(empty(), ofArray(this$.Publications)), fromValueWithDefault(empty(), ofArray(this$.Contacts)), studies, fromValueWithDefault(empty(), ofArray(this$.Comments)));
    }
    static fromInvestigation(i) {
        let identifer;
        const matchValue = i.Identifier;
        identifer = ((matchValue == null) ? createMissingIdentifier() : matchValue);
        const patternInput = unzip(map_3((arg) => ArcStudy.fromStudy(arg), defaultArg(i.Studies, empty())));
        const studiesRaw = patternInput[0];
        const studies = Array.from(studiesRaw);
        let studyIdentifiers;
        const arg_1 = map_2((a) => a.Identifier, studiesRaw);
        studyIdentifiers = Array.from(arg_1);
        let assays;
        const arg_2 = distinctBy((a_1) => a_1.Identifier, concat(patternInput[1]), {
            Equals: (x, y) => (x === y),
            GetHashCode: stringHash,
        });
        assays = Array.from(arg_2);
        return ArcInvestigation.create(identifer, i.Title, i.Description, i.SubmissionDate, i.PublicReleaseDate, void 0, map_1(toArray, i.Publications), map_1(toArray, i.Contacts), assays, studies, studyIdentifiers, map_1(toArray, i.Comments));
    }
}

export function ArcInvestigation_$reflection() {
    return class_type("ARCtrl.ISA.ArcInvestigation", void 0, ArcInvestigation);
}

export function ArcInvestigation_$ctor_21AB11E9(identifier, title, description, submissionDate, publicReleaseDate, ontologySourceReferences, publications, contacts, assays, studies, registeredStudyIdentifiers, comments, remarks) {
    return new ArcInvestigation(identifier, title, description, submissionDate, publicReleaseDate, ontologySourceReferences, publications, contacts, assays, studies, registeredStudyIdentifiers, comments, remarks);
}

