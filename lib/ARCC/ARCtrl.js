import { exactlyOne, choose, map } from "./fable_modules/fable-library.4.1.4/Array.js";
import { toFsWorkbook as toFsWorkbook_1, fromFsWorkbook } from "./ISA/ISA.Spreadsheet/ArcAssay.js";
import { tryFromContract } from "./Contracts/Contracts.ArcAssay.js";
import { ARCtrl_ISA_ArcStudy__ArcStudy_toFsWorkbook_Static_Z2A9662E9, ARCtrl_ISA_ArcStudy__ArcStudy_fromFsWorkbook_Static_32154C9D } from "./ISA/ISA.Spreadsheet/ArcStudy.js";
import { tryFromContract as tryFromContract_1 } from "./Contracts/Contracts.ArcStudy.js";
import { toFsWorkbook, fromFsWorkbook as fromFsWorkbook_1 } from "./ISA/ISA.Spreadsheet/ArcInvestigation.js";
import { tryFromContract as tryFromContract_2 } from "./Contracts/Contracts.ArcInvestigation.js";
import { tryFind, iterate, toArray } from "./fable_modules/fable-library.4.1.4/Seq.js";
import { createRunsFolder, createWorkflowsFolder, createInvestigationFile, createStudyFolder, createStudiesFolder, createAssayFolder, createAssaysFolder } from "./FileSystemTree.js";
import { FileSystemTree } from "./FileSystem/FileSystemTree.js";
import { FileSystem } from "./FileSystem/FileSystem.js";
import { map as map_1, defaultArg, unwrap } from "./fable_modules/fable-library.4.1.4/Option.js";
import { tryISAReadContractFromPath } from "./Contracts/Contracts.ARCtrl.js";
import { addToDict } from "./fable_modules/fable-library.4.1.4/MapUtil.js";
import { ArcInvestigation } from "./ISA/ISA/ArcTypes/ArcTypes.js";
import { printf, toConsole } from "./fable_modules/fable-library.4.1.4/String.js";
import { Assay_fileNameFromIdentifier, Study_fileNameFromIdentifier } from "./ISA/ISA/Identifier.js";
import { Dictionary_tryGet } from "./fable_modules/FsSpreadsheet.4.1.0/Cells/FsCellsCollection.fs.js";
import { Contract } from "./Contract/Contract.js";
import { class_type } from "./fable_modules/fable-library.4.1.4/Reflection.js";

export function ARCAux_getArcAssaysFromContracts(contracts) {
    return map(fromFsWorkbook, choose(tryFromContract, contracts));
}

export function ARCAux_getArcStudiesFromContracts(contracts) {
    return map(ARCtrl_ISA_ArcStudy__ArcStudy_fromFsWorkbook_Static_32154C9D, choose(tryFromContract_1, contracts));
}

export function ARCAux_getArcInvestigationFromContracts(contracts) {
    return fromFsWorkbook_1(exactlyOne(choose(tryFromContract_2, contracts)));
}

export function ARCAux_updateFSByISA(isa, fs) {
    let patternInput;
    if (isa == null) {
        patternInput = [[], []];
    }
    else {
        const inv = isa;
        patternInput = [toArray(inv.StudyIdentifiers), toArray(inv.AssayIdentifiers)];
    }
    const assays = createAssaysFolder(map(createAssayFolder, patternInput[1]));
    const studies = createStudiesFolder(map(createStudyFolder, patternInput[0]));
    const investigation = createInvestigationFile();
    let tree;
    const arg = FileSystemTree.createRootFolder([investigation, assays, studies]);
    tree = FileSystem.create({
        tree: arg,
    });
    return fs.Union(tree);
}

export function ARCAux_updateFSByCWL(cwl, fs) {
    const workflows = createWorkflowsFolder([]);
    const runs = createRunsFolder([]);
    let tree;
    const arg = FileSystemTree.createRootFolder([workflows, runs]);
    tree = FileSystem.create({
        tree: arg,
    });
    return fs.Union(tree);
}

export class ARC {
    constructor(isa, cwl, fs) {
        this.cwl = cwl;
        this._isa = isa;
        this._cwl = this.cwl;
        this._fs = ARCAux_updateFSByCWL(this.cwl, ARCAux_updateFSByISA(isa, defaultArg(fs, FileSystem.create({
            tree: new FileSystemTree(1, ["", []]),
        }))));
    }
    get ISA() {
        const this$ = this;
        return unwrap(this$._isa);
    }
    set ISA(newISA) {
        const this$ = this;
        this$._isa = newISA;
    }
    get CWL() {
        const this$ = this;
        return this$.cwl;
    }
    get FileSystem() {
        const this$ = this;
        return this$._fs;
    }
    static fromFilePaths(filePaths) {
        return new ARC(void 0, void 0, FileSystem.fromFilePaths(filePaths));
    }
    GetReadContracts() {
        const this$ = this;
        return choose(tryISAReadContractFromPath, this$._fs.Tree.ToFilePaths());
    }
    SetISAFromContracts(contracts, enableLogging) {
        const this$ = this;
        const enableLogging_1 = defaultArg(enableLogging, false);
        const investigation = ARCAux_getArcInvestigationFromContracts(contracts);
        const studies = map((tuple) => tuple[0], ARCAux_getArcStudiesFromContracts(contracts));
        const assays = ARCAux_getArcAssaysFromContracts(contracts);
        iterate((study) => {
            const registeredStudyOpt = tryFind((s) => (s.Identifier === study.Identifier), investigation.Studies);
            if (registeredStudyOpt == null) {
                investigation.AddRegisteredStudy(study);
            }
            else {
                const registeredStudy = registeredStudyOpt;
                registeredStudy.UpdateReferenceByStudyFile(study, true);
            }
        }, studies);
        iterate((assay) => {
            const registeredAssayOpt = tryFind((a) => (a.Identifier === assay.Identifier), investigation.Assays);
            if (registeredAssayOpt == null) {
                investigation.AddAssay(assay);
            }
            else {
                const registeredAssay = registeredAssayOpt;
                registeredAssay.UpdateReferenceByAssayFile(assay, true);
            }
        }, assays);
        this$.ISA = investigation;
    }
    UpdateFileSystem() {
        const this$ = this;
        let newFS;
        const fs = ARCAux_updateFSByISA(this$._isa, this$._fs);
        newFS = ARCAux_updateFSByCWL(this$._cwl, fs);
        this$._fs = newFS;
    }
    GetWriteContracts() {
        const this$ = this;
        const workbooks = new Map([]);
        const matchValue = this$.ISA;
        if (matchValue == null) {
            addToDict(workbooks, "isa.investigation.xlsx", ["ISA_Investigation", toFsWorkbook(ArcInvestigation.create("MISSING_IDENTIFIER_"))]);
            toConsole(printf("ARC contains no ISA part."));
        }
        else {
            const inv = matchValue;
            addToDict(workbooks, "isa.investigation.xlsx", ["ISA_Investigation", toFsWorkbook(inv)]);
            iterate((s) => {
                addToDict(workbooks, Study_fileNameFromIdentifier(s.Identifier), ["ISA_Study", ARCtrl_ISA_ArcStudy__ArcStudy_toFsWorkbook_Static_Z2A9662E9(s)]);
            }, inv.Studies);
            iterate((a) => {
                addToDict(workbooks, Assay_fileNameFromIdentifier(a.Identifier), ["ISA_Assay", toFsWorkbook_1(a)]);
            }, inv.Assays);
        }
        return map((fp) => {
            const matchValue_1 = Dictionary_tryGet(fp, workbooks);
            if (matchValue_1 == null) {
                return Contract.createCreate(fp, "PlainText");
            }
            else {
                const wb = matchValue_1[1];
                const dto = matchValue_1[0];
                return Contract.createCreate(fp, dto, wb);
            }
        }, this$._fs.Tree.ToFilePaths(true));
    }
    Copy() {
        const this$ = this;
        const isaCopy = map_1((i) => i.Copy(), this$._isa);
        const fsCopy = this$._fs.Copy();
        return new ARC(unwrap(isaCopy), this$._cwl, fsCopy);
    }
}

export function ARC_$reflection() {
    return class_type("ARCtrl.ARC", void 0, ARC);
}

export function ARC_$ctor_81B80F4(isa, cwl, fs) {
    return new ARC(isa, cwl, fs);
}

