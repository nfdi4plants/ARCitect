import { append as append_1, tryPick, map2, map, tryFind } from "../../../fable_modules/fable-library.4.1.4/Array.js";
import { equals } from "../../../fable_modules/fable-library.4.1.4/Util.js";
import { singleton, append } from "../../../fable_modules/fable-library.4.1.4/List.js";
import { record_type, array_type, option_type, string_type, getRecordFields, makeRecord } from "../../../fable_modules/fable-library.4.1.4/Reflection.js";
import { Update_updateOnlyByExistingAppend, Update_updateOnlyByExisting, Update_updateAppend } from "../Update.js";
import { fromValueWithDefault, mapDefault } from "../OptionExtensions.js";
import { endsWith } from "../../../fable_modules/fable-library.4.1.4/String.js";
import { map as map_1, defaultArg, value as value_2 } from "../../../fable_modules/fable-library.4.1.4/Option.js";
import { Comment$_$reflection, Comment$ } from "./Comment.js";
import { Record } from "../../../fable_modules/fable-library.4.1.4/Types.js";
import { OntologyAnnotation_$reflection } from "./OntologyAnnotation.js";

export class Person extends Record {
    constructor(ID, ORCID, LastName, FirstName, MidInitials, EMail, Phone, Fax, Address, Affiliation, Roles, Comments) {
        super();
        this.ID = ID;
        this.ORCID = ORCID;
        this.LastName = LastName;
        this.FirstName = FirstName;
        this.MidInitials = MidInitials;
        this.EMail = EMail;
        this.Phone = Phone;
        this.Fax = Fax;
        this.Address = Address;
        this.Affiliation = Affiliation;
        this.Roles = Roles;
        this.Comments = Comments;
    }
    static make(id, orcid, lastName, firstName, midInitials, email, phone, fax, address, affiliation, roles, comments) {
        return new Person(id, orcid, lastName, firstName, midInitials, email, phone, fax, address, affiliation, roles, comments);
    }
    static create(Id, ORCID, LastName, FirstName, MidInitials, Email, Phone, Fax, Address, Affiliation, Roles, Comments) {
        return Person.make(Id, ORCID, LastName, FirstName, MidInitials, Email, Phone, Fax, Address, Affiliation, Roles, Comments);
    }
    static get empty() {
        return Person.create();
    }
    static tryGetByFullName(firstName, midInitials, lastName, persons) {
        return tryFind((p) => ((midInitials === "") ? (equals(p.FirstName, firstName) && equals(p.LastName, lastName)) : ((equals(p.FirstName, firstName) && equals(p.MidInitials, midInitials)) && equals(p.LastName, lastName))), persons);
    }
    static existsByFullName(firstName, midInitials, lastName, persons) {
        return persons.some((p) => ((midInitials === "") ? (equals(p.FirstName, firstName) && equals(p.LastName, lastName)) : ((equals(p.FirstName, firstName) && equals(p.MidInitials, midInitials)) && equals(p.LastName, lastName))));
    }
    static add(persons, person) {
        return append(persons, singleton(person));
    }
    static updateBy(predicate, updateOption, person, persons) {
        return persons.some(predicate) ? map((p) => {
            if (predicate(p)) {
                const this$ = updateOption;
                const recordType_1 = p;
                const recordType_2 = person;
                switch (this$.tag) {
                    case 2:
                        return makeRecord(Person_$reflection(), map2(Update_updateAppend, getRecordFields(recordType_1), getRecordFields(recordType_2)));
                    case 1:
                        return makeRecord(Person_$reflection(), map2(Update_updateOnlyByExisting, getRecordFields(recordType_1), getRecordFields(recordType_2)));
                    case 3:
                        return makeRecord(Person_$reflection(), map2(Update_updateOnlyByExistingAppend, getRecordFields(recordType_1), getRecordFields(recordType_2)));
                    default:
                        return recordType_2;
                }
            }
            else {
                return p;
            }
        }, persons) : persons;
    }
    static updateByFullName(updateOption, person, persons) {
        return Person.updateBy((p) => {
            if (equals(p.FirstName, person.FirstName) && equals(p.MidInitials, person.MidInitials)) {
                return equals(p.LastName, person.LastName);
            }
            else {
                return false;
            }
        }, updateOption, person, persons);
    }
    static removeByFullName(firstName, midInitials, lastName, persons) {
        return persons.filter((p) => ((midInitials === "") ? !(equals(p.FirstName, firstName) && equals(p.LastName, lastName)) : !((equals(p.FirstName, firstName) && equals(p.MidInitials, midInitials)) && equals(p.LastName, lastName))));
    }
    static getRoles(person) {
        return person.Roles;
    }
    static mapRoles(f, person) {
        return new Person(person.ID, person.ORCID, person.LastName, person.FirstName, person.MidInitials, person.EMail, person.Phone, person.Fax, person.Address, person.Affiliation, mapDefault([], f, person.Roles), person.Comments);
    }
    static setRoles(person, roles) {
        return new Person(person.ID, person.ORCID, person.LastName, person.FirstName, person.MidInitials, person.EMail, person.Phone, person.Fax, person.Address, person.Affiliation, roles, person.Comments);
    }
    static getComments(person) {
        return person.Comments;
    }
    static mapComments(f, person) {
        return new Person(person.ID, person.ORCID, person.LastName, person.FirstName, person.MidInitials, person.EMail, person.Phone, person.Fax, person.Address, person.Affiliation, person.Roles, mapDefault([], f, person.Comments));
    }
    static setComments(person, comments) {
        return new Person(person.ID, person.ORCID, person.LastName, person.FirstName, person.MidInitials, person.EMail, person.Phone, person.Fax, person.Address, person.Affiliation, person.Roles, comments);
    }
    static get orcidKey() {
        return "ORCID";
    }
    static setOrcidFromComments(person) {
        const isOrcidComment = (c) => {
            if (c.Name != null) {
                return endsWith(value_2(c.Name).toLocaleUpperCase(), Person.orcidKey);
            }
            else {
                return false;
            }
        };
        const patternInput = defaultArg(map_1((comments) => [tryPick((c_1) => {
            if (isOrcidComment(c_1)) {
                return c_1.Value;
            }
            else {
                return void 0;
            }
        }, comments), fromValueWithDefault([], comments.filter((arg) => !isOrcidComment(arg)))], person.Comments), [void 0, person.Comments]);
        return new Person(person.ID, patternInput[0], person.LastName, person.FirstName, person.MidInitials, person.EMail, person.Phone, person.Fax, person.Address, person.Affiliation, person.Roles, patternInput[1]);
    }
    static setCommentFromORCID(person) {
        let matchValue, matchValue_1, orcid_1, comments, orcid;
        return new Person(person.ID, person.ORCID, person.LastName, person.FirstName, person.MidInitials, person.EMail, person.Phone, person.Fax, person.Address, person.Affiliation, person.Roles, (matchValue = person.ORCID, (matchValue_1 = person.Comments, (matchValue == null) ? matchValue_1 : ((matchValue_1 == null) ? ((orcid_1 = matchValue, [Comment$.create(void 0, Person.orcidKey, orcid_1)])) : ((comments = matchValue_1, (orcid = matchValue, append_1(comments, [Comment$.create(void 0, Person.orcidKey, orcid)]))))))));
    }
    Copy() {
        const this$ = this;
        const nextComments = map_1((array) => map((c) => c.Copy(), array), this$.Comments);
        const arg_10 = map_1((array_1) => map((c_1) => c_1.Copy(), array_1), this$.Roles);
        return Person.make(this$.ID, this$.ORCID, this$.LastName, this$.FirstName, this$.MidInitials, this$.EMail, this$.Phone, this$.Fax, this$.Address, this$.Affiliation, arg_10, nextComments);
    }
}

export function Person_$reflection() {
    return record_type("ARCtrl.ISA.Person", [], Person, () => [["ID", option_type(string_type)], ["ORCID", option_type(string_type)], ["LastName", option_type(string_type)], ["FirstName", option_type(string_type)], ["MidInitials", option_type(string_type)], ["EMail", option_type(string_type)], ["Phone", option_type(string_type)], ["Fax", option_type(string_type)], ["Address", option_type(string_type)], ["Affiliation", option_type(string_type)], ["Roles", option_type(array_type(OntologyAnnotation_$reflection()))], ["Comments", option_type(array_type(Comment$_$reflection()))]]);
}

