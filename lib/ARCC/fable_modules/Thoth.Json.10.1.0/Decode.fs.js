import { toFail, printf, toText, join } from "../fable-library.4.1.4/String.js";
import { Result_Bind, Result_Map, FSharpResult$2 } from "../fable-library.4.1.4/Choice.js";
import { Util_CachedDecoders, Util_Cache$1__GetOrAdd_43981464, CaseStrategy, Util_Casing_convert, ErrorReason } from "./Types.fs.js";
import { tryParse as tryParse_2 } from "../fable-library.4.1.4/Guid.js";
import { toString as toString_12, FSharpRef } from "../fable-library.4.1.4/Types.js";
import { tryParse as tryParse_3 } from "../fable-library.4.1.4/Int32.js";
import { parse, fromInt32, toUInt64, fromFloat64, toInt64, toFloat64 } from "../fable-library.4.1.4/BigInt.js";
import { tryParse as tryParse_4 } from "../fable-library.4.1.4/Long.js";
import { tryParse as tryParse_5 } from "../fable-library.4.1.4/Decimal.js";
import Decimal from "../fable-library.4.1.4/Decimal.js";
import { toUniversalTime, tryParse as tryParse_6, minValue } from "../fable-library.4.1.4/Date.js";
import { tryParse as tryParse_7, minValue as minValue_1 } from "../fable-library.4.1.4/DateOffset.js";
import { tryParse as tryParse_8 } from "../fable-library.4.1.4/TimeSpan.js";
import { map as map_4, defaultArg, some } from "../fable-library.4.1.4/Option.js";
import { ofArray, toArray, map as map_1, length, singleton, append as append_1, tail as tail_1, head as head_1, isEmpty, ofSeq, empty, reverse, fold, tryLast, cons } from "../fable-library.4.1.4/List.js";
import { int16ToString, numberHash, compare, comparePrimitives, uncurry3, defaultOf, uncurry2, int32ToString } from "../fable-library.4.1.4/Util.js";
import { map as map_2, tryFind, foldBack, fill, fold as fold_1 } from "../fable-library.4.1.4/Array.js";
import { contains, fold as fold_2, toList, append, reverse as reverse_1 } from "../fable-library.4.1.4/Seq.js";
import { getGenerics, getGenericTypeDefinition, makeTuple, getTupleElements, isTuple, isGenericType, parseEnum, getEnumValues, getEnumUnderlyingType, isEnum, getElementType, isArray, isUnion, makeRecord, getRecordElements, isRecord, fullName as fullName_1, makeUnion as makeUnion_1, getUnionCaseFields, getUnionCases, name as name_3, class_type } from "../fable-library.4.1.4/Reflection.js";
import { empty as empty_1, map as map_3, tryFind as tryFind_1, add, ofSeq as ofSeq_1, ofList } from "../fable-library.4.1.4/Map.js";
import { ofSeq as ofSeq_2 } from "../fable-library.4.1.4/Set.js";

export function Helpers_isUndefined(o) {
    return (typeof o) === "undefined";
}

function genericMsg(msg, value_1, newLine) {
    try {
        return ((("Expecting " + msg) + " but instead got:") + (newLine ? "\n" : " ")) + (JSON.stringify(value_1, null, 4) + '');
    }
    catch (matchValue) {
        return (("Expecting " + msg) + " but decoder failed. Couldn\'t report given value due to circular structure.") + (newLine ? "\n" : " ");
    }
}

function errorToString(path, error) {
    const reason_1 = (error.tag === 2) ? genericMsg(error.fields[0], error.fields[1], true) : ((error.tag === 1) ? ((genericMsg(error.fields[0], error.fields[1], false) + "\nReason: ") + error.fields[2]) : ((error.tag === 3) ? genericMsg(error.fields[0], error.fields[1], true) : ((error.tag === 4) ? (genericMsg(error.fields[0], error.fields[1], true) + (("\nNode `" + error.fields[2]) + "` is unkown.")) : ((error.tag === 5) ? ((("Expecting " + error.fields[0]) + ".\n") + (JSON.stringify(error.fields[1], null, 4) + '')) : ((error.tag === 7) ? ("The following errors were found:\n\n" + join("\n\n", error.fields[0])) : ((error.tag === 6) ? ("The following `failure` occurred with the decoder: " + error.fields[0]) : genericMsg(error.fields[0], error.fields[1], false)))))));
    if (error.tag === 7) {
        return reason_1;
    }
    else {
        return (("Error at: `" + path) + "`\n") + reason_1;
    }
}

/**
 * Runs the decoder against the given JSON value.
 * 
 * If the decoder fails, it reports the error prefixed with the given path.
 */
export function fromValue(path, decoder, value_1) {
    const matchValue = decoder(path, value_1);
    if (matchValue.tag === 1) {
        const error = matchValue.fields[0];
        return new FSharpResult$2(1, [errorToString(error[0], error[1])]);
    }
    else {
        return new FSharpResult$2(0, [matchValue.fields[0]]);
    }
}

/**
 * Parse the provided string in as JSON and then run the decoder against it.
 */
export function fromString(decoder, value_1) {
    try {
        return fromValue("$", decoder, JSON.parse(value_1));
    }
    catch (matchValue) {
        if (matchValue instanceof SyntaxError) {
            return new FSharpResult$2(1, ["Given an invalid JSON: " + matchValue.message]);
        }
        else {
            throw matchValue;
        }
    }
}

/**
 * Parse the provided string in as JSON and then run the decoder against it.
 */
export function unsafeFromString(decoder, value_1) {
    const matchValue = fromString(decoder, value_1);
    if (matchValue.tag === 1) {
        throw new Error(matchValue.fields[0]);
    }
    else {
        return matchValue.fields[0];
    }
}

export function decodeValue(path, decoder) {
    const decoder_1 = decoder;
    return (value_1) => fromValue(path, decoder_1, value_1);
}

export function decodeString(decoder) {
    const decoder_1 = decoder;
    return (value_1) => fromString(decoder_1, value_1);
}

export function string(path, value_1) {
    if (typeof value_1 === "string") {
        return new FSharpResult$2(0, [value_1]);
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a string", value_1])]]);
    }
}

export function char(path, value_1) {
    if (typeof value_1 === "string") {
        const str = value_1;
        if (str.length === 1) {
            return new FSharpResult$2(0, [str[0]]);
        }
        else {
            return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a single character string", value_1])]]);
        }
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a char", value_1])]]);
    }
}

export function guid(path, value_1) {
    if (typeof value_1 === "string") {
        let matchValue;
        let outArg = "00000000-0000-0000-0000-000000000000";
        matchValue = [tryParse_2(value_1, new FSharpRef(() => outArg, (v) => {
            outArg = v;
        })), outArg];
        if (matchValue[0]) {
            return new FSharpResult$2(0, [matchValue[1]]);
        }
        else {
            return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a guid", value_1])]]);
        }
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a guid", value_1])]]);
    }
}

export function unit(path, value_1) {
    if (value_1 == null) {
        return new FSharpResult$2(0, [void 0]);
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["null", value_1])]]);
    }
}

export const sbyte = (path) => ((value_2) => {
    const path_1 = path;
    const value_3 = value_2;
    if ((typeof value_3) === "number") {
        const value_1_1 = value_3;
        return (isFinite(value_1_1) && Math.floor(value_1_1) === value_1_1) ? (((-128 <= value_1_1) && (value_1_1 <= 127)) ? (new FSharpResult$2(0, [(value_1_1 + 0x80 & 0xFF) - 0x80])) : (new FSharpResult$2(1, [[path_1, new ErrorReason(1, ["a sbyte", value_1_1, "Value was either too large or too small for a sbyte"])]]))) : (new FSharpResult$2(1, [[path_1, new ErrorReason(1, ["a sbyte", value_1_1, "Value is not an integral value"])]]));
    }
    else if (typeof value_3 === "string") {
        let matchValue;
        let outArg = 0;
        matchValue = [tryParse_3(value_3, 511, false, 8, new FSharpRef(() => outArg, (v) => {
            outArg = (v | 0);
        })), outArg];
        return matchValue[0] ? (new FSharpResult$2(0, [matchValue[1]])) : (new FSharpResult$2(1, [[path_1, new ErrorReason(0, ["a sbyte", value_3])]]));
    }
    else {
        return new FSharpResult$2(1, [[path_1, new ErrorReason(0, ["a sbyte", value_3])]]);
    }
});

export const byte = (path) => ((value_2) => {
    const path_1 = path;
    const value_3 = value_2;
    if ((typeof value_3) === "number") {
        const value_1_1 = value_3;
        return (isFinite(value_1_1) && Math.floor(value_1_1) === value_1_1) ? (((0 <= value_1_1) && (value_1_1 <= 255)) ? (new FSharpResult$2(0, [value_1_1 & 0xFF])) : (new FSharpResult$2(1, [[path_1, new ErrorReason(1, ["a byte", value_1_1, "Value was either too large or too small for a byte"])]]))) : (new FSharpResult$2(1, [[path_1, new ErrorReason(1, ["a byte", value_1_1, "Value is not an integral value"])]]));
    }
    else if (typeof value_3 === "string") {
        let matchValue;
        let outArg = 0;
        matchValue = [tryParse_3(value_3, 511, true, 8, new FSharpRef(() => outArg, (v) => {
            outArg = v;
        })), outArg];
        return matchValue[0] ? (new FSharpResult$2(0, [matchValue[1]])) : (new FSharpResult$2(1, [[path_1, new ErrorReason(0, ["a byte", value_3])]]));
    }
    else {
        return new FSharpResult$2(1, [[path_1, new ErrorReason(0, ["a byte", value_3])]]);
    }
});

export const int16 = (path) => ((value_2) => {
    const path_1 = path;
    const value_3 = value_2;
    if ((typeof value_3) === "number") {
        const value_1_1 = value_3;
        return (isFinite(value_1_1) && Math.floor(value_1_1) === value_1_1) ? (((-32768 <= value_1_1) && (value_1_1 <= 32767)) ? (new FSharpResult$2(0, [(value_1_1 + 0x8000 & 0xFFFF) - 0x8000])) : (new FSharpResult$2(1, [[path_1, new ErrorReason(1, ["an int16", value_1_1, "Value was either too large or too small for an int16"])]]))) : (new FSharpResult$2(1, [[path_1, new ErrorReason(1, ["an int16", value_1_1, "Value is not an integral value"])]]));
    }
    else if (typeof value_3 === "string") {
        let matchValue;
        let outArg = 0;
        matchValue = [tryParse_3(value_3, 511, false, 16, new FSharpRef(() => outArg, (v) => {
            outArg = (v | 0);
        })), outArg];
        return matchValue[0] ? (new FSharpResult$2(0, [matchValue[1]])) : (new FSharpResult$2(1, [[path_1, new ErrorReason(0, ["an int16", value_3])]]));
    }
    else {
        return new FSharpResult$2(1, [[path_1, new ErrorReason(0, ["an int16", value_3])]]);
    }
});

export const uint16 = (path) => ((value_2) => {
    const path_1 = path;
    const value_3 = value_2;
    if ((typeof value_3) === "number") {
        const value_1_1 = value_3;
        return (isFinite(value_1_1) && Math.floor(value_1_1) === value_1_1) ? (((0 <= value_1_1) && (value_1_1 <= 65535)) ? (new FSharpResult$2(0, [value_1_1 & 0xFFFF])) : (new FSharpResult$2(1, [[path_1, new ErrorReason(1, ["an uint16", value_1_1, "Value was either too large or too small for an uint16"])]]))) : (new FSharpResult$2(1, [[path_1, new ErrorReason(1, ["an uint16", value_1_1, "Value is not an integral value"])]]));
    }
    else if (typeof value_3 === "string") {
        let matchValue;
        let outArg = 0;
        matchValue = [tryParse_3(value_3, 511, true, 16, new FSharpRef(() => outArg, (v) => {
            outArg = v;
        })), outArg];
        return matchValue[0] ? (new FSharpResult$2(0, [matchValue[1]])) : (new FSharpResult$2(1, [[path_1, new ErrorReason(0, ["an uint16", value_3])]]));
    }
    else {
        return new FSharpResult$2(1, [[path_1, new ErrorReason(0, ["an uint16", value_3])]]);
    }
});

export const int = (path) => ((value_2) => {
    const path_1 = path;
    const value_3 = value_2;
    if ((typeof value_3) === "number") {
        const value_1_1 = value_3;
        return (isFinite(value_1_1) && Math.floor(value_1_1) === value_1_1) ? (((-2147483648 <= value_1_1) && (value_1_1 <= 2147483647)) ? (new FSharpResult$2(0, [~~value_1_1])) : (new FSharpResult$2(1, [[path_1, new ErrorReason(1, ["an int", value_1_1, "Value was either too large or too small for an int"])]]))) : (new FSharpResult$2(1, [[path_1, new ErrorReason(1, ["an int", value_1_1, "Value is not an integral value"])]]));
    }
    else if (typeof value_3 === "string") {
        let matchValue;
        let outArg = 0;
        matchValue = [tryParse_3(value_3, 511, false, 32, new FSharpRef(() => outArg, (v) => {
            outArg = (v | 0);
        })), outArg];
        return matchValue[0] ? (new FSharpResult$2(0, [matchValue[1]])) : (new FSharpResult$2(1, [[path_1, new ErrorReason(0, ["an int", value_3])]]));
    }
    else {
        return new FSharpResult$2(1, [[path_1, new ErrorReason(0, ["an int", value_3])]]);
    }
});

export const uint32 = (path) => ((value_2) => {
    const path_1 = path;
    const value_3 = value_2;
    if ((typeof value_3) === "number") {
        const value_1_1 = value_3;
        return (isFinite(value_1_1) && Math.floor(value_1_1) === value_1_1) ? (((0 <= value_1_1) && (value_1_1 <= 4294967295)) ? (new FSharpResult$2(0, [value_1_1 >>> 0])) : (new FSharpResult$2(1, [[path_1, new ErrorReason(1, ["an uint32", value_1_1, "Value was either too large or too small for an uint32"])]]))) : (new FSharpResult$2(1, [[path_1, new ErrorReason(1, ["an uint32", value_1_1, "Value is not an integral value"])]]));
    }
    else if (typeof value_3 === "string") {
        let matchValue;
        let outArg = 0;
        matchValue = [tryParse_3(value_3, 511, true, 32, new FSharpRef(() => outArg, (v) => {
            outArg = v;
        })), outArg];
        return matchValue[0] ? (new FSharpResult$2(0, [matchValue[1]])) : (new FSharpResult$2(1, [[path_1, new ErrorReason(0, ["an uint32", value_3])]]));
    }
    else {
        return new FSharpResult$2(1, [[path_1, new ErrorReason(0, ["an uint32", value_3])]]);
    }
});

export const int64 = (path) => ((value_2) => {
    const path_1 = path;
    const value_3 = value_2;
    if ((typeof value_3) === "number") {
        const value_1_1 = value_3;
        return (isFinite(value_1_1) && Math.floor(value_1_1) === value_1_1) ? (((toFloat64(-9223372036854775808n) <= value_1_1) && (value_1_1 <= toFloat64(9223372036854775807n))) ? (new FSharpResult$2(0, [toInt64(fromFloat64(value_1_1))])) : (new FSharpResult$2(1, [[path_1, new ErrorReason(1, ["an int64", value_1_1, "Value was either too large or too small for an int64"])]]))) : (new FSharpResult$2(1, [[path_1, new ErrorReason(1, ["an int64", value_1_1, "Value is not an integral value"])]]));
    }
    else if (typeof value_3 === "string") {
        let matchValue;
        let outArg = 0n;
        matchValue = [tryParse_4(value_3, 511, false, 64, new FSharpRef(() => outArg, (v) => {
            outArg = v;
        })), outArg];
        return matchValue[0] ? (new FSharpResult$2(0, [matchValue[1]])) : (new FSharpResult$2(1, [[path_1, new ErrorReason(0, ["an int64", value_3])]]));
    }
    else {
        return new FSharpResult$2(1, [[path_1, new ErrorReason(0, ["an int64", value_3])]]);
    }
});

export const uint64 = (path) => ((value_2) => {
    const path_1 = path;
    const value_3 = value_2;
    if ((typeof value_3) === "number") {
        const value_1_1 = value_3;
        return (isFinite(value_1_1) && Math.floor(value_1_1) === value_1_1) ? (((toFloat64(0n) <= value_1_1) && (value_1_1 <= toFloat64(18446744073709551615n))) ? (new FSharpResult$2(0, [toUInt64(fromFloat64(value_1_1))])) : (new FSharpResult$2(1, [[path_1, new ErrorReason(1, ["an uint64", value_1_1, "Value was either too large or too small for an uint64"])]]))) : (new FSharpResult$2(1, [[path_1, new ErrorReason(1, ["an uint64", value_1_1, "Value is not an integral value"])]]));
    }
    else if (typeof value_3 === "string") {
        let matchValue;
        let outArg = 0n;
        matchValue = [tryParse_4(value_3, 511, true, 64, new FSharpRef(() => outArg, (v) => {
            outArg = v;
        })), outArg];
        return matchValue[0] ? (new FSharpResult$2(0, [matchValue[1]])) : (new FSharpResult$2(1, [[path_1, new ErrorReason(0, ["an uint64", value_3])]]));
    }
    else {
        return new FSharpResult$2(1, [[path_1, new ErrorReason(0, ["an uint64", value_3])]]);
    }
});

export function bigint(path, value_1) {
    if ((typeof value_1) === "number") {
        return new FSharpResult$2(0, [fromInt32(value_1)]);
    }
    else if (typeof value_1 === "string") {
        try {
            return new FSharpResult$2(0, [parse(value_1)]);
        }
        catch (matchValue) {
            return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a bigint", value_1])]]);
        }
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a bigint", value_1])]]);
    }
}

export function bool(path, value_1) {
    if (typeof value_1 === "boolean") {
        return new FSharpResult$2(0, [value_1]);
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a boolean", value_1])]]);
    }
}

export function float(path, value_1) {
    if ((typeof value_1) === "number") {
        return new FSharpResult$2(0, [value_1]);
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a float", value_1])]]);
    }
}

export function float32(path, value_1) {
    if ((typeof value_1) === "number") {
        return new FSharpResult$2(0, [value_1]);
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a float32", value_1])]]);
    }
}

export function decimal(path, value_1) {
    if ((typeof value_1) === "number") {
        return new FSharpResult$2(0, [new Decimal(value_1)]);
    }
    else if (typeof value_1 === "string") {
        let matchValue;
        let outArg = new Decimal("0");
        matchValue = [tryParse_5(value_1, new FSharpRef(() => outArg, (v) => {
            outArg = v;
        })), outArg];
        if (matchValue[0]) {
            return new FSharpResult$2(0, [matchValue[1]]);
        }
        else {
            return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a decimal", value_1])]]);
        }
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a decimal", value_1])]]);
    }
}

export function datetime(path, value_1) {
    if (typeof value_1 === "string") {
        let matchValue;
        let outArg = minValue();
        matchValue = [tryParse_6(value_1, new FSharpRef(() => outArg, (v) => {
            outArg = v;
        })), outArg];
        if (matchValue[0]) {
            return new FSharpResult$2(0, [toUniversalTime(matchValue[1])]);
        }
        else {
            return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a datetime", value_1])]]);
        }
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a datetime", value_1])]]);
    }
}

/**
 * Decode a System.DateTime value using Sytem.DateTime.TryParse, then convert it to UTC.
 */
export function datetimeUtc(path, value_1) {
    if (typeof value_1 === "string") {
        let matchValue;
        let outArg = minValue();
        matchValue = [tryParse_6(value_1, new FSharpRef(() => outArg, (v) => {
            outArg = v;
        })), outArg];
        if (matchValue[0]) {
            return new FSharpResult$2(0, [toUniversalTime(matchValue[1])]);
        }
        else {
            return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a datetime", value_1])]]);
        }
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a datetime", value_1])]]);
    }
}

/**
 * Decode a System.DateTime with DateTime.TryParse; uses default System.DateTimeStyles.
 */
export function datetimeLocal(path, value_1) {
    if (typeof value_1 === "string") {
        let matchValue;
        let outArg = minValue();
        matchValue = [tryParse_6(value_1, new FSharpRef(() => outArg, (v) => {
            outArg = v;
        })), outArg];
        if (matchValue[0]) {
            return new FSharpResult$2(0, [matchValue[1]]);
        }
        else {
            return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a datetime", value_1])]]);
        }
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a datetime", value_1])]]);
    }
}

export function datetimeOffset(path, value_1) {
    if (typeof value_1 === "string") {
        let matchValue;
        let outArg = minValue_1();
        matchValue = [tryParse_7(value_1, new FSharpRef(() => outArg, (v) => {
            outArg = v;
        })), outArg];
        if (matchValue[0]) {
            return new FSharpResult$2(0, [matchValue[1]]);
        }
        else {
            return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a datetimeoffset", value_1])]]);
        }
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a datetime", value_1])]]);
    }
}

export function timespan(path, value_1) {
    if (typeof value_1 === "string") {
        let matchValue;
        let outArg = 0;
        matchValue = [tryParse_8(value_1, new FSharpRef(() => outArg, (v) => {
            outArg = v;
        })), outArg];
        if (matchValue[0]) {
            return new FSharpResult$2(0, [matchValue[1]]);
        }
        else {
            return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a timespan", value_1])]]);
        }
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a timespan", value_1])]]);
    }
}

function decodeMaybeNull(path, decoder, value_1) {
    if (value_1 == null) {
        return new FSharpResult$2(0, [void 0]);
    }
    else {
        const matchValue = decoder(path, value_1);
        if (matchValue.tag === 1) {
            return new FSharpResult$2(1, [matchValue.fields[0]]);
        }
        else {
            return new FSharpResult$2(0, [some(matchValue.fields[0])]);
        }
    }
}

export function optional(fieldName, decoder, path, value_1) {
    if (value_1 === null ? false : (Object.getPrototypeOf(value_1 || false) === Object.prototype)) {
        const fieldValue = value_1[fieldName];
        if (Helpers_isUndefined(fieldValue)) {
            return new FSharpResult$2(0, [void 0]);
        }
        else {
            return decodeMaybeNull((path + ".") + fieldName, decoder, fieldValue);
        }
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(2, ["an object", value_1])]]);
    }
}

function badPathError(fieldNames, currentPath, value_1) {
    return new FSharpResult$2(1, [[defaultArg(currentPath, join(".", cons("$", fieldNames))), new ErrorReason(4, [("an object with path `" + join(".", fieldNames)) + "`", value_1, defaultArg(tryLast(fieldNames), "")])]]);
}

export function optionalAt(fieldNames, decoder, firstPath, firstValue) {
    const _arg = fold((tupledArg, field_1) => {
        const curPath = tupledArg[0];
        const curValue = tupledArg[1];
        const res = tupledArg[2];
        if (res == null) {
            if (curValue == null) {
                return [curPath, curValue, new FSharpResult$2(0, [void 0])];
            }
            else if (curValue === null ? false : (Object.getPrototypeOf(curValue || false) === Object.prototype)) {
                return [(curPath + ".") + field_1, curValue[field_1], void 0];
            }
            else {
                return [curPath, curValue, new FSharpResult$2(1, [[curPath, new ErrorReason(2, ["an object", curValue])]])];
            }
        }
        else {
            return [curPath, curValue, res];
        }
    }, [firstPath, firstValue, void 0], fieldNames);
    if (_arg[2] == null) {
        const lastValue = _arg[1];
        if (Helpers_isUndefined(lastValue)) {
            return new FSharpResult$2(0, [void 0]);
        }
        else {
            return decodeMaybeNull(_arg[0], decoder, lastValue);
        }
    }
    else {
        return _arg[2];
    }
}

export function field(fieldName, decoder, path, value_1) {
    if (value_1 === null ? false : (Object.getPrototypeOf(value_1 || false) === Object.prototype)) {
        const fieldValue = value_1[fieldName];
        if (Helpers_isUndefined(fieldValue)) {
            return new FSharpResult$2(1, [[path, new ErrorReason(3, [("an object with a field named `" + fieldName) + "`", value_1])]]);
        }
        else {
            return decoder((path + ".") + fieldName, fieldValue);
        }
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(2, ["an object", value_1])]]);
    }
}

export function at(fieldNames, decoder, firstPath, firstValue) {
    const _arg = fold((tupledArg, field_1) => {
        const curPath = tupledArg[0];
        const curValue = tupledArg[1];
        const res = tupledArg[2];
        if (res == null) {
            if (curValue == null) {
                return [curPath, curValue, badPathError(fieldNames, curPath, firstValue)];
            }
            else if (curValue === null ? false : (Object.getPrototypeOf(curValue || false) === Object.prototype)) {
                const curValue_1 = curValue[field_1];
                if (Helpers_isUndefined(curValue_1)) {
                    return [curPath, curValue_1, badPathError(fieldNames, void 0, firstValue)];
                }
                else {
                    return [(curPath + ".") + field_1, curValue_1, void 0];
                }
            }
            else {
                return [curPath, curValue, new FSharpResult$2(1, [[curPath, new ErrorReason(2, ["an object", curValue])]])];
            }
        }
        else {
            return [curPath, curValue, res];
        }
    }, [firstPath, firstValue, void 0], fieldNames);
    if (_arg[2] == null) {
        return decoder(_arg[0], _arg[1]);
    }
    else {
        return _arg[2];
    }
}

export function index(requestedIndex, decoder, path, value_1) {
    let copyOfStruct;
    const currentPath = ((path + ".[") + int32ToString(requestedIndex)) + "]";
    if (Array.isArray(value_1)) {
        const vArray = value_1;
        if (requestedIndex < vArray.length) {
            return decoder(currentPath, vArray[requestedIndex]);
        }
        else {
            return new FSharpResult$2(1, [[currentPath, new ErrorReason(5, [((("a longer array. Need index `" + int32ToString(requestedIndex)) + "` but there are only `") + ((copyOfStruct = vArray.length, int32ToString(copyOfStruct)))) + "` entries", value_1])]]);
        }
    }
    else {
        return new FSharpResult$2(1, [[currentPath, new ErrorReason(0, ["an array", value_1])]]);
    }
}

export function option(decoder, path, value_1) {
    if (value_1 == null) {
        return new FSharpResult$2(0, [void 0]);
    }
    else {
        return Result_Map(some, decoder(path, value_1));
    }
}

export function list(decoder, path, value_1) {
    if (Array.isArray(value_1)) {
        let i = -1;
        return Result_Map(reverse, fold_1((acc, value_2) => {
            i = ((i + 1) | 0);
            if (acc.tag === 0) {
                const matchValue = decoder(((path + ".[") + int32ToString(i)) + "]", value_2);
                if (matchValue.tag === 0) {
                    return new FSharpResult$2(0, [cons(matchValue.fields[0], acc.fields[0])]);
                }
                else {
                    return new FSharpResult$2(1, [matchValue.fields[0]]);
                }
            }
            else {
                return acc;
            }
        }, new FSharpResult$2(0, [empty()]), value_1));
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a list", value_1])]]);
    }
}

export function seq(decoder, path, value_1) {
    if (Array.isArray(value_1)) {
        let i = -1;
        return Result_Map(reverse_1, fold_1((acc, value_2) => {
            i = ((i + 1) | 0);
            if (acc.tag === 0) {
                const matchValue = decoder(((path + ".[") + int32ToString(i)) + "]", value_2);
                if (matchValue.tag === 0) {
                    return new FSharpResult$2(0, [append([matchValue.fields[0]], acc.fields[0])]);
                }
                else {
                    return new FSharpResult$2(1, [matchValue.fields[0]]);
                }
            }
            else {
                return acc;
            }
        }, new FSharpResult$2(0, [[]]), value_1));
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["a seq", value_1])]]);
    }
}

export function array(decoder, path, value_1) {
    if (Array.isArray(value_1)) {
        let i = -1;
        const tokens = value_1;
        return fold_1((acc, value_2) => {
            i = ((i + 1) | 0);
            if (acc.tag === 0) {
                const acc_1 = acc.fields[0];
                const matchValue = decoder(((path + ".[") + int32ToString(i)) + "]", value_2);
                if (matchValue.tag === 0) {
                    acc_1[i] = matchValue.fields[0];
                    return new FSharpResult$2(0, [acc_1]);
                }
                else {
                    return new FSharpResult$2(1, [matchValue.fields[0]]);
                }
            }
            else {
                return acc;
            }
        }, new FSharpResult$2(0, [fill(new Array(tokens.length), 0, tokens.length, null)]), tokens);
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["an array", value_1])]]);
    }
}

export function keys(path, value_1) {
    if (value_1 === null ? false : (Object.getPrototypeOf(value_1 || false) === Object.prototype)) {
        return new FSharpResult$2(0, [ofSeq(Object.keys(value_1))]);
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["an object", value_1])]]);
    }
}

export function keyValuePairs(decoder, path, value_1) {
    const matchValue = keys(path, value_1);
    if (matchValue.tag === 1) {
        return new FSharpResult$2(1, [matchValue.fields[0]]);
    }
    else {
        return Result_Map(reverse, fold((acc, prop) => {
            if (acc.tag === 0) {
                const matchValue_1 = decoder(path, value_1[prop]);
                if (matchValue_1.tag === 0) {
                    return new FSharpResult$2(0, [cons([prop, matchValue_1.fields[0]], acc.fields[0])]);
                }
                else {
                    return new FSharpResult$2(1, [matchValue_1.fields[0]]);
                }
            }
            else {
                return acc;
            }
        }, new FSharpResult$2(0, [empty()]), matchValue.fields[0]));
    }
}

export function oneOf(decoders, path, value_1) {
    const runner = (decoders_1_mut, errors_mut) => {
        runner:
        while (true) {
            const decoders_1 = decoders_1_mut, errors = errors_mut;
            if (isEmpty(decoders_1)) {
                return new FSharpResult$2(1, [[path, new ErrorReason(7, [errors])]]);
            }
            else {
                const matchValue = fromValue(path, uncurry2(head_1(decoders_1)), value_1);
                if (matchValue.tag === 1) {
                    decoders_1_mut = tail_1(decoders_1);
                    errors_mut = append_1(errors, singleton(matchValue.fields[0]));
                    continue runner;
                }
                else {
                    return new FSharpResult$2(0, [matchValue.fields[0]]);
                }
            }
            break;
        }
    };
    return runner(decoders, empty());
}

export function nil(output, path, value_1) {
    if (value_1 == null) {
        return new FSharpResult$2(0, [output]);
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["null", value_1])]]);
    }
}

export function value(_arg, v) {
    return new FSharpResult$2(0, [v]);
}

export function succeed(output, _arg, _arg_1) {
    return new FSharpResult$2(0, [output]);
}

export function fail(msg, path, _arg) {
    return new FSharpResult$2(1, [[path, new ErrorReason(6, [msg])]]);
}

export function andThen(cb, decoder, path, value_1) {
    const matchValue = decoder(path, value_1);
    if (matchValue.tag === 0) {
        return cb(matchValue.fields[0], path, value_1);
    }
    else {
        return new FSharpResult$2(1, [matchValue.fields[0]]);
    }
}

export function all(decoders, path, value_1) {
    const runner = (decoders_1_mut, values_mut) => {
        runner:
        while (true) {
            const decoders_1 = decoders_1_mut, values = values_mut;
            if (isEmpty(decoders_1)) {
                return new FSharpResult$2(0, [values]);
            }
            else {
                const matchValue = head_1(decoders_1)(path)(value_1);
                if (matchValue.tag === 1) {
                    return new FSharpResult$2(1, [matchValue.fields[0]]);
                }
                else {
                    decoders_1_mut = tail_1(decoders_1);
                    values_mut = append_1(values, singleton(matchValue.fields[0]));
                    continue runner;
                }
            }
            break;
        }
    };
    return runner(decoders, empty());
}

export function map(ctor, d1, path, value_1) {
    const matchValue = d1(path, value_1);
    if (matchValue.tag === 1) {
        return new FSharpResult$2(1, [matchValue.fields[0]]);
    }
    else {
        return new FSharpResult$2(0, [ctor(matchValue.fields[0])]);
    }
}

export function map2(ctor, d1, d2, path, value_1) {
    const matchValue = d1(path, value_1);
    const matchValue_1 = d2(path, value_1);
    const copyOfStruct = matchValue;
    if (copyOfStruct.tag === 1) {
        return new FSharpResult$2(1, [copyOfStruct.fields[0]]);
    }
    else {
        const copyOfStruct_1 = matchValue_1;
        if (copyOfStruct_1.tag === 1) {
            return new FSharpResult$2(1, [copyOfStruct_1.fields[0]]);
        }
        else {
            return new FSharpResult$2(0, [ctor(copyOfStruct.fields[0], copyOfStruct_1.fields[0])]);
        }
    }
}

export function map3(ctor, d1, d2, d3, path, value_1) {
    const matchValue = d1(path, value_1);
    const matchValue_1 = d2(path, value_1);
    const matchValue_2 = d3(path, value_1);
    const copyOfStruct = matchValue;
    if (copyOfStruct.tag === 1) {
        return new FSharpResult$2(1, [copyOfStruct.fields[0]]);
    }
    else {
        const copyOfStruct_1 = matchValue_1;
        if (copyOfStruct_1.tag === 1) {
            return new FSharpResult$2(1, [copyOfStruct_1.fields[0]]);
        }
        else {
            const copyOfStruct_2 = matchValue_2;
            if (copyOfStruct_2.tag === 1) {
                return new FSharpResult$2(1, [copyOfStruct_2.fields[0]]);
            }
            else {
                return new FSharpResult$2(0, [ctor(copyOfStruct.fields[0], copyOfStruct_1.fields[0], copyOfStruct_2.fields[0])]);
            }
        }
    }
}

export function map4(ctor, d1, d2, d3, d4, path, value_1) {
    const matchValue = d1(path, value_1);
    const matchValue_1 = d2(path, value_1);
    const matchValue_2 = d3(path, value_1);
    const matchValue_3 = d4(path, value_1);
    const copyOfStruct = matchValue;
    if (copyOfStruct.tag === 1) {
        return new FSharpResult$2(1, [copyOfStruct.fields[0]]);
    }
    else {
        const copyOfStruct_1 = matchValue_1;
        if (copyOfStruct_1.tag === 1) {
            return new FSharpResult$2(1, [copyOfStruct_1.fields[0]]);
        }
        else {
            const copyOfStruct_2 = matchValue_2;
            if (copyOfStruct_2.tag === 1) {
                return new FSharpResult$2(1, [copyOfStruct_2.fields[0]]);
            }
            else {
                const copyOfStruct_3 = matchValue_3;
                if (copyOfStruct_3.tag === 1) {
                    return new FSharpResult$2(1, [copyOfStruct_3.fields[0]]);
                }
                else {
                    return new FSharpResult$2(0, [ctor(copyOfStruct.fields[0], copyOfStruct_1.fields[0], copyOfStruct_2.fields[0], copyOfStruct_3.fields[0])]);
                }
            }
        }
    }
}

export function map5(ctor, d1, d2, d3, d4, d5, path, value_1) {
    const matchValue = d1(path, value_1);
    const matchValue_1 = d2(path, value_1);
    const matchValue_2 = d3(path, value_1);
    const matchValue_3 = d4(path, value_1);
    const matchValue_4 = d5(path, value_1);
    const copyOfStruct = matchValue;
    if (copyOfStruct.tag === 1) {
        return new FSharpResult$2(1, [copyOfStruct.fields[0]]);
    }
    else {
        const copyOfStruct_1 = matchValue_1;
        if (copyOfStruct_1.tag === 1) {
            return new FSharpResult$2(1, [copyOfStruct_1.fields[0]]);
        }
        else {
            const copyOfStruct_2 = matchValue_2;
            if (copyOfStruct_2.tag === 1) {
                return new FSharpResult$2(1, [copyOfStruct_2.fields[0]]);
            }
            else {
                const copyOfStruct_3 = matchValue_3;
                if (copyOfStruct_3.tag === 1) {
                    return new FSharpResult$2(1, [copyOfStruct_3.fields[0]]);
                }
                else {
                    const copyOfStruct_4 = matchValue_4;
                    if (copyOfStruct_4.tag === 1) {
                        return new FSharpResult$2(1, [copyOfStruct_4.fields[0]]);
                    }
                    else {
                        return new FSharpResult$2(0, [ctor(copyOfStruct.fields[0], copyOfStruct_1.fields[0], copyOfStruct_2.fields[0], copyOfStruct_3.fields[0], copyOfStruct_4.fields[0])]);
                    }
                }
            }
        }
    }
}

export function map6(ctor, d1, d2, d3, d4, d5, d6, path, value_1) {
    const matchValue = d1(path, value_1);
    const matchValue_1 = d2(path, value_1);
    const matchValue_2 = d3(path, value_1);
    const matchValue_3 = d4(path, value_1);
    const matchValue_4 = d5(path, value_1);
    const matchValue_5 = d6(path, value_1);
    const copyOfStruct = matchValue;
    if (copyOfStruct.tag === 1) {
        return new FSharpResult$2(1, [copyOfStruct.fields[0]]);
    }
    else {
        const copyOfStruct_1 = matchValue_1;
        if (copyOfStruct_1.tag === 1) {
            return new FSharpResult$2(1, [copyOfStruct_1.fields[0]]);
        }
        else {
            const copyOfStruct_2 = matchValue_2;
            if (copyOfStruct_2.tag === 1) {
                return new FSharpResult$2(1, [copyOfStruct_2.fields[0]]);
            }
            else {
                const copyOfStruct_3 = matchValue_3;
                if (copyOfStruct_3.tag === 1) {
                    return new FSharpResult$2(1, [copyOfStruct_3.fields[0]]);
                }
                else {
                    const copyOfStruct_4 = matchValue_4;
                    if (copyOfStruct_4.tag === 1) {
                        return new FSharpResult$2(1, [copyOfStruct_4.fields[0]]);
                    }
                    else {
                        const copyOfStruct_5 = matchValue_5;
                        if (copyOfStruct_5.tag === 1) {
                            return new FSharpResult$2(1, [copyOfStruct_5.fields[0]]);
                        }
                        else {
                            return new FSharpResult$2(0, [ctor(copyOfStruct.fields[0], copyOfStruct_1.fields[0], copyOfStruct_2.fields[0], copyOfStruct_3.fields[0], copyOfStruct_4.fields[0], copyOfStruct_5.fields[0])]);
                        }
                    }
                }
            }
        }
    }
}

export function map7(ctor, d1, d2, d3, d4, d5, d6, d7, path, value_1) {
    const matchValue = d1(path, value_1);
    const matchValue_1 = d2(path, value_1);
    const matchValue_2 = d3(path, value_1);
    const matchValue_3 = d4(path, value_1);
    const matchValue_4 = d5(path, value_1);
    const matchValue_5 = d6(path, value_1);
    const matchValue_6 = d7(path, value_1);
    const copyOfStruct = matchValue;
    if (copyOfStruct.tag === 1) {
        return new FSharpResult$2(1, [copyOfStruct.fields[0]]);
    }
    else {
        const copyOfStruct_1 = matchValue_1;
        if (copyOfStruct_1.tag === 1) {
            return new FSharpResult$2(1, [copyOfStruct_1.fields[0]]);
        }
        else {
            const copyOfStruct_2 = matchValue_2;
            if (copyOfStruct_2.tag === 1) {
                return new FSharpResult$2(1, [copyOfStruct_2.fields[0]]);
            }
            else {
                const copyOfStruct_3 = matchValue_3;
                if (copyOfStruct_3.tag === 1) {
                    return new FSharpResult$2(1, [copyOfStruct_3.fields[0]]);
                }
                else {
                    const copyOfStruct_4 = matchValue_4;
                    if (copyOfStruct_4.tag === 1) {
                        return new FSharpResult$2(1, [copyOfStruct_4.fields[0]]);
                    }
                    else {
                        const copyOfStruct_5 = matchValue_5;
                        if (copyOfStruct_5.tag === 1) {
                            return new FSharpResult$2(1, [copyOfStruct_5.fields[0]]);
                        }
                        else {
                            const copyOfStruct_6 = matchValue_6;
                            if (copyOfStruct_6.tag === 1) {
                                return new FSharpResult$2(1, [copyOfStruct_6.fields[0]]);
                            }
                            else {
                                return new FSharpResult$2(0, [ctor(copyOfStruct.fields[0], copyOfStruct_1.fields[0], copyOfStruct_2.fields[0], copyOfStruct_3.fields[0], copyOfStruct_4.fields[0], copyOfStruct_5.fields[0], copyOfStruct_6.fields[0])]);
                            }
                        }
                    }
                }
            }
        }
    }
}

export function map8(ctor, d1, d2, d3, d4, d5, d6, d7, d8, path, value_1) {
    const matchValue = d1(path, value_1);
    const matchValue_1 = d2(path, value_1);
    const matchValue_2 = d3(path, value_1);
    const matchValue_3 = d4(path, value_1);
    const matchValue_4 = d5(path, value_1);
    const matchValue_5 = d6(path, value_1);
    const matchValue_6 = d7(path, value_1);
    const matchValue_7 = d8(path, value_1);
    const copyOfStruct = matchValue;
    if (copyOfStruct.tag === 1) {
        return new FSharpResult$2(1, [copyOfStruct.fields[0]]);
    }
    else {
        const copyOfStruct_1 = matchValue_1;
        if (copyOfStruct_1.tag === 1) {
            return new FSharpResult$2(1, [copyOfStruct_1.fields[0]]);
        }
        else {
            const copyOfStruct_2 = matchValue_2;
            if (copyOfStruct_2.tag === 1) {
                return new FSharpResult$2(1, [copyOfStruct_2.fields[0]]);
            }
            else {
                const copyOfStruct_3 = matchValue_3;
                if (copyOfStruct_3.tag === 1) {
                    return new FSharpResult$2(1, [copyOfStruct_3.fields[0]]);
                }
                else {
                    const copyOfStruct_4 = matchValue_4;
                    if (copyOfStruct_4.tag === 1) {
                        return new FSharpResult$2(1, [copyOfStruct_4.fields[0]]);
                    }
                    else {
                        const copyOfStruct_5 = matchValue_5;
                        if (copyOfStruct_5.tag === 1) {
                            return new FSharpResult$2(1, [copyOfStruct_5.fields[0]]);
                        }
                        else {
                            const copyOfStruct_6 = matchValue_6;
                            if (copyOfStruct_6.tag === 1) {
                                return new FSharpResult$2(1, [copyOfStruct_6.fields[0]]);
                            }
                            else {
                                const copyOfStruct_7 = matchValue_7;
                                if (copyOfStruct_7.tag === 1) {
                                    return new FSharpResult$2(1, [copyOfStruct_7.fields[0]]);
                                }
                                else {
                                    return new FSharpResult$2(0, [ctor(copyOfStruct.fields[0], copyOfStruct_1.fields[0], copyOfStruct_2.fields[0], copyOfStruct_3.fields[0], copyOfStruct_4.fields[0], copyOfStruct_5.fields[0], copyOfStruct_6.fields[0], copyOfStruct_7.fields[0])]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * Allow to incrementally apply a decoder, for building large objects.
 */
export function andMap() {
    return (d) => ((d_1) => ((path) => ((value_1) => map2((arg, func) => func(arg), uncurry2(d), uncurry2(d_1), path, value_1))));
}

function unwrapWith(errors, path, decoder, value_1) {
    const matchValue = decoder(path, value_1);
    if (matchValue.tag === 1) {
        void (errors.push(matchValue.fields[0]));
        return defaultOf();
    }
    else {
        return matchValue.fields[0];
    }
}

export class Getters$1 {
    constructor(path, v) {
        let _this, _this_1;
        this.errors = [];
        this.required = ((_this = this, {
            Field(fieldName, decoder) {
                return unwrapWith(_this.errors, path, (path_1, value_1) => field(fieldName, decoder, path_1, value_1), v);
            },
            At(fieldNames, decoder_2) {
                return unwrapWith(_this.errors, path, (firstPath, firstValue) => at(fieldNames, decoder_2, firstPath, firstValue), v);
            },
            Raw(decoder_4) {
                return unwrapWith(_this.errors, path, decoder_4, v);
            },
        }));
        this.optional = ((_this_1 = this, {
            Field(fieldName_1, decoder_5) {
                return unwrapWith(_this_1.errors, path, (path_2, value_2) => optional(fieldName_1, decoder_5, path_2, value_2), v);
            },
            At(fieldNames_1, decoder_7) {
                return unwrapWith(_this_1.errors, path, (firstPath_1, firstValue_1) => optionalAt(fieldNames_1, decoder_7, firstPath_1, firstValue_1), v);
            },
            Raw(decoder_9) {
                const matchValue = decoder_9(path, v);
                if (matchValue.tag === 1) {
                    const reason = matchValue.fields[0][1];
                    const error = matchValue.fields[0];
                    let matchResult, v_2;
                    switch (reason.tag) {
                        case 3:
                        case 4: {
                            matchResult = 1;
                            break;
                        }
                        case 5:
                        case 6:
                        case 7: {
                            matchResult = 2;
                            break;
                        }
                        case 1: {
                            matchResult = 0;
                            v_2 = reason.fields[1];
                            break;
                        }
                        case 2: {
                            matchResult = 0;
                            v_2 = reason.fields[1];
                            break;
                        }
                        default: {
                            matchResult = 0;
                            v_2 = reason.fields[1];
                        }
                    }
                    switch (matchResult) {
                        case 0:
                            if (v_2 == null) {
                                return void 0;
                            }
                            else {
                                void (_this_1.errors.push(error));
                                return defaultOf();
                            }
                        case 1:
                            return void 0;
                        default: {
                            void (_this_1.errors.push(error));
                            return defaultOf();
                        }
                    }
                }
                else {
                    return some(matchValue.fields[0]);
                }
            },
        }));
    }
    get Required() {
        const __ = this;
        return __.required;
    }
    get Optional() {
        const __ = this;
        return __.optional;
    }
}

export function Getters$1_$reflection(gen0) {
    return class_type("Thoth.Json.Decode.Getters`1", [gen0], Getters$1);
}

export function Getters$1_$ctor_4A51B60E(path, v) {
    return new Getters$1(path, v);
}

export function Getters$1__get_Errors(__) {
    return toList(__.errors);
}

export function object(builder, path, v) {
    const getters = Getters$1_$ctor_4A51B60E(path, v);
    const result = builder(getters);
    const matchValue = Getters$1__get_Errors(getters);
    if (!isEmpty(matchValue)) {
        const errors = matchValue;
        if (length(errors) > 1) {
            return new FSharpResult$2(1, [[path, new ErrorReason(7, [map_1((tupledArg) => errorToString(tupledArg[0], tupledArg[1]), errors)])]]);
        }
        else {
            return new FSharpResult$2(1, [head_1(matchValue)]);
        }
    }
    else {
        return new FSharpResult$2(0, [result]);
    }
}

export function tuple2(decoder1, decoder2) {
    let decoder_3;
    const decoder = decoder1;
    decoder_3 = ((path) => ((value_1) => index(0, decoder, path, value_1)));
    return (path_3) => ((value_4) => andThen(uncurry3((v1) => {
        let decoder_2;
        const decoder_1 = decoder2;
        decoder_2 = ((path_1) => ((value_2) => index(1, decoder_1, path_1, value_2)));
        return (path_2) => ((value_3) => andThen((v2, arg10$0040, arg20$0040) => succeed([v1, v2], arg10$0040, arg20$0040), uncurry2(decoder_2), path_2, value_3));
    }), uncurry2(decoder_3), path_3, value_4));
}

export function tuple3(decoder1, decoder2, decoder3) {
    let decoder_5;
    const decoder = decoder1;
    decoder_5 = ((path) => ((value_1) => index(0, decoder, path, value_1)));
    return (path_5) => ((value_6) => andThen(uncurry3((v1) => {
        let decoder_4;
        const decoder_1 = decoder2;
        decoder_4 = ((path_1) => ((value_2) => index(1, decoder_1, path_1, value_2)));
        return (path_4) => ((value_5) => andThen(uncurry3((v2) => {
            let decoder_3;
            const decoder_2 = decoder3;
            decoder_3 = ((path_2) => ((value_3) => index(2, decoder_2, path_2, value_3)));
            return (path_3) => ((value_4) => andThen((v3, arg10$0040, arg20$0040) => succeed([v1, v2, v3], arg10$0040, arg20$0040), uncurry2(decoder_3), path_3, value_4));
        }), uncurry2(decoder_4), path_4, value_5));
    }), uncurry2(decoder_5), path_5, value_6));
}

export function tuple4(decoder1, decoder2, decoder3, decoder4) {
    let decoder_7;
    const decoder = decoder1;
    decoder_7 = ((path) => ((value_1) => index(0, decoder, path, value_1)));
    return (path_7) => ((value_8) => andThen(uncurry3((v1) => {
        let decoder_6;
        const decoder_1 = decoder2;
        decoder_6 = ((path_1) => ((value_2) => index(1, decoder_1, path_1, value_2)));
        return (path_6) => ((value_7) => andThen(uncurry3((v2) => {
            let decoder_5;
            const decoder_2 = decoder3;
            decoder_5 = ((path_2) => ((value_3) => index(2, decoder_2, path_2, value_3)));
            return (path_5) => ((value_6) => andThen(uncurry3((v3) => {
                let decoder_4;
                const decoder_3 = decoder4;
                decoder_4 = ((path_3) => ((value_4) => index(3, decoder_3, path_3, value_4)));
                return (path_4) => ((value_5) => andThen((v4, arg10$0040, arg20$0040) => succeed([v1, v2, v3, v4], arg10$0040, arg20$0040), uncurry2(decoder_4), path_4, value_5));
            }), uncurry2(decoder_5), path_5, value_6));
        }), uncurry2(decoder_6), path_6, value_7));
    }), uncurry2(decoder_7), path_7, value_8));
}

export function tuple5(decoder1, decoder2, decoder3, decoder4, decoder5) {
    let decoder_9;
    const decoder = decoder1;
    decoder_9 = ((path) => ((value_1) => index(0, decoder, path, value_1)));
    return (path_9) => ((value_10) => andThen(uncurry3((v1) => {
        let decoder_8;
        const decoder_1 = decoder2;
        decoder_8 = ((path_1) => ((value_2) => index(1, decoder_1, path_1, value_2)));
        return (path_8) => ((value_9) => andThen(uncurry3((v2) => {
            let decoder_7;
            const decoder_2 = decoder3;
            decoder_7 = ((path_2) => ((value_3) => index(2, decoder_2, path_2, value_3)));
            return (path_7) => ((value_8) => andThen(uncurry3((v3) => {
                let decoder_6;
                const decoder_3 = decoder4;
                decoder_6 = ((path_3) => ((value_4) => index(3, decoder_3, path_3, value_4)));
                return (path_6) => ((value_7) => andThen(uncurry3((v4) => {
                    let decoder_5;
                    const decoder_4 = decoder5;
                    decoder_5 = ((path_4) => ((value_5) => index(4, decoder_4, path_4, value_5)));
                    return (path_5) => ((value_6) => andThen((v5, arg10$0040, arg20$0040) => succeed([v1, v2, v3, v4, v5], arg10$0040, arg20$0040), uncurry2(decoder_5), path_5, value_6));
                }), uncurry2(decoder_6), path_6, value_7));
            }), uncurry2(decoder_7), path_7, value_8));
        }), uncurry2(decoder_8), path_8, value_9));
    }), uncurry2(decoder_9), path_9, value_10));
}

export function tuple6(decoder1, decoder2, decoder3, decoder4, decoder5, decoder6) {
    let decoder_11;
    const decoder = decoder1;
    decoder_11 = ((path) => ((value_1) => index(0, decoder, path, value_1)));
    return (path_11) => ((value_12) => andThen(uncurry3((v1) => {
        let decoder_10;
        const decoder_1 = decoder2;
        decoder_10 = ((path_1) => ((value_2) => index(1, decoder_1, path_1, value_2)));
        return (path_10) => ((value_11) => andThen(uncurry3((v2) => {
            let decoder_9;
            const decoder_2 = decoder3;
            decoder_9 = ((path_2) => ((value_3) => index(2, decoder_2, path_2, value_3)));
            return (path_9) => ((value_10) => andThen(uncurry3((v3) => {
                let decoder_8;
                const decoder_3 = decoder4;
                decoder_8 = ((path_3) => ((value_4) => index(3, decoder_3, path_3, value_4)));
                return (path_8) => ((value_9) => andThen(uncurry3((v4) => {
                    let decoder_7;
                    const decoder_4 = decoder5;
                    decoder_7 = ((path_4) => ((value_5) => index(4, decoder_4, path_4, value_5)));
                    return (path_7) => ((value_8) => andThen(uncurry3((v5) => {
                        let decoder_6;
                        const decoder_5 = decoder6;
                        decoder_6 = ((path_5) => ((value_6) => index(5, decoder_5, path_5, value_6)));
                        return (path_6) => ((value_7) => andThen((v6, arg10$0040, arg20$0040) => succeed([v1, v2, v3, v4, v5, v6], arg10$0040, arg20$0040), uncurry2(decoder_6), path_6, value_7));
                    }), uncurry2(decoder_7), path_7, value_8));
                }), uncurry2(decoder_8), path_8, value_9));
            }), uncurry2(decoder_9), path_9, value_10));
        }), uncurry2(decoder_10), path_10, value_11));
    }), uncurry2(decoder_11), path_11, value_12));
}

export function tuple7(decoder1, decoder2, decoder3, decoder4, decoder5, decoder6, decoder7) {
    let decoder_13;
    const decoder = decoder1;
    decoder_13 = ((path) => ((value_1) => index(0, decoder, path, value_1)));
    return (path_13) => ((value_14) => andThen(uncurry3((v1) => {
        let decoder_12;
        const decoder_1 = decoder2;
        decoder_12 = ((path_1) => ((value_2) => index(1, decoder_1, path_1, value_2)));
        return (path_12) => ((value_13) => andThen(uncurry3((v2) => {
            let decoder_11;
            const decoder_2 = decoder3;
            decoder_11 = ((path_2) => ((value_3) => index(2, decoder_2, path_2, value_3)));
            return (path_11) => ((value_12) => andThen(uncurry3((v3) => {
                let decoder_10;
                const decoder_3 = decoder4;
                decoder_10 = ((path_3) => ((value_4) => index(3, decoder_3, path_3, value_4)));
                return (path_10) => ((value_11) => andThen(uncurry3((v4) => {
                    let decoder_9;
                    const decoder_4 = decoder5;
                    decoder_9 = ((path_4) => ((value_5) => index(4, decoder_4, path_4, value_5)));
                    return (path_9) => ((value_10) => andThen(uncurry3((v5) => {
                        let decoder_8;
                        const decoder_5 = decoder6;
                        decoder_8 = ((path_5) => ((value_6) => index(5, decoder_5, path_5, value_6)));
                        return (path_8) => ((value_9) => andThen(uncurry3((v6) => {
                            let decoder_7;
                            const decoder_6 = decoder7;
                            decoder_7 = ((path_6) => ((value_7) => index(6, decoder_6, path_6, value_7)));
                            return (path_7) => ((value_8) => andThen((v7, arg10$0040, arg20$0040) => succeed([v1, v2, v3, v4, v5, v6, v7], arg10$0040, arg20$0040), uncurry2(decoder_7), path_7, value_8));
                        }), uncurry2(decoder_8), path_8, value_9));
                    }), uncurry2(decoder_9), path_9, value_10));
                }), uncurry2(decoder_10), path_10, value_11));
            }), uncurry2(decoder_11), path_11, value_12));
        }), uncurry2(decoder_12), path_12, value_13));
    }), uncurry2(decoder_13), path_13, value_14));
}

export function tuple8(decoder1, decoder2, decoder3, decoder4, decoder5, decoder6, decoder7, decoder8) {
    let decoder_15;
    const decoder = decoder1;
    decoder_15 = ((path) => ((value_1) => index(0, decoder, path, value_1)));
    return (path_15) => ((value_16) => andThen(uncurry3((v1) => {
        let decoder_14;
        const decoder_1 = decoder2;
        decoder_14 = ((path_1) => ((value_2) => index(1, decoder_1, path_1, value_2)));
        return (path_14) => ((value_15) => andThen(uncurry3((v2) => {
            let decoder_13;
            const decoder_2 = decoder3;
            decoder_13 = ((path_2) => ((value_3) => index(2, decoder_2, path_2, value_3)));
            return (path_13) => ((value_14) => andThen(uncurry3((v3) => {
                let decoder_12;
                const decoder_3 = decoder4;
                decoder_12 = ((path_3) => ((value_4) => index(3, decoder_3, path_3, value_4)));
                return (path_12) => ((value_13) => andThen(uncurry3((v4) => {
                    let decoder_11;
                    const decoder_4 = decoder5;
                    decoder_11 = ((path_4) => ((value_5) => index(4, decoder_4, path_4, value_5)));
                    return (path_11) => ((value_12) => andThen(uncurry3((v5) => {
                        let decoder_10;
                        const decoder_5 = decoder6;
                        decoder_10 = ((path_5) => ((value_6) => index(5, decoder_5, path_5, value_6)));
                        return (path_10) => ((value_11) => andThen(uncurry3((v6) => {
                            let decoder_9;
                            const decoder_6 = decoder7;
                            decoder_9 = ((path_6) => ((value_7) => index(6, decoder_6, path_6, value_7)));
                            return (path_9) => ((value_10) => andThen(uncurry3((v7) => {
                                let decoder_8;
                                const decoder_7 = decoder8;
                                decoder_8 = ((path_7) => ((value_8) => index(7, decoder_7, path_7, value_8)));
                                return (path_8) => ((value_9) => andThen((v8, arg10$0040, arg20$0040) => succeed([v1, v2, v3, v4, v5, v6, v7, v8], arg10$0040, arg20$0040), uncurry2(decoder_8), path_8, value_9));
                            }), uncurry2(decoder_9), path_9, value_10));
                        }), uncurry2(decoder_10), path_10, value_11));
                    }), uncurry2(decoder_11), path_11, value_12));
                }), uncurry2(decoder_12), path_12, value_13));
            }), uncurry2(decoder_13), path_13, value_14));
        }), uncurry2(decoder_14), path_14, value_15));
    }), uncurry2(decoder_15), path_15, value_16));
}

export function dict(decoder) {
    let d;
    const decoder_1 = decoder;
    d = ((path) => ((value_1) => keyValuePairs(decoder_1, path, value_1)));
    return (path_1) => ((value_2) => map((elements) => ofList(elements, {
        Compare: comparePrimitives,
    }), uncurry2(d), path_1, value_2));
}

export function map$0027(keyDecoder, valueDecoder) {
    let d;
    const decoder = tuple2(keyDecoder, valueDecoder);
    d = ((path) => ((value_1) => array(uncurry2(decoder), path, value_1)));
    return (path_1) => ((value_2) => map((elements) => ofSeq_1(elements, {
        Compare: compare,
    }), uncurry2(d), path_1, value_2));
}

function toMap(xs) {
    return ofSeq_1(xs, {
        Compare: compare,
    });
}

function toSet(xs) {
    return ofSeq_2(xs, {
        Compare: compare,
    });
}

function autoObject(decoderInfos, path, value_1) {
    if (!(value_1 === null ? false : (Object.getPrototypeOf(value_1 || false) === Object.prototype))) {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["an object", value_1])]]);
    }
    else {
        return foldBack((tupledArg, acc) => {
            const name = tupledArg[0];
            if (acc.tag === 0) {
                return Result_Map((v) => cons(v, acc.fields[0]), tupledArg[1]((path + ".") + name)(value_1[name]));
            }
            else {
                return acc;
            }
        }, decoderInfos, new FSharpResult$2(0, [empty()]));
    }
}

function autoObject2(keyDecoder, valueDecoder, path, value_1) {
    if (!(value_1 === null ? false : (Object.getPrototypeOf(value_1 || false) === Object.prototype))) {
        return new FSharpResult$2(1, [[path, new ErrorReason(0, ["an object", value_1])]]);
    }
    else {
        return fold_2((acc, name) => {
            if (acc.tag === 0) {
                const matchValue = keyDecoder(path, name);
                if (matchValue.tag === 0) {
                    const _arg = valueDecoder((path + ".") + name, value_1[name]);
                    if (_arg.tag === 0) {
                        return new FSharpResult$2(0, [cons([matchValue.fields[0], _arg.fields[0]], acc.fields[0])]);
                    }
                    else {
                        return new FSharpResult$2(1, [_arg.fields[0]]);
                    }
                }
                else {
                    return new FSharpResult$2(1, [matchValue.fields[0]]);
                }
            }
            else {
                return acc;
            }
        }, new FSharpResult$2(0, [empty()]), Object.keys(value_1));
    }
}

function mixedArray(offset, decoders, path, values) {
    let arg_1;
    const expectedLength = (decoders.length + offset) | 0;
    if (expectedLength !== values.length) {
        return new FSharpResult$2(1, [[path, new ErrorReason(6, [(arg_1 = (values.length | 0), toText(printf("Expected array of length %i but got %i"))(expectedLength)(arg_1))])]]);
    }
    else {
        let result = new FSharpResult$2(0, [empty()]);
        for (let i = offset; i <= (values.length - 1); i++) {
            if (result.tag === 0) {
                const acc = result.fields[0];
                const path_1 = toText(printf("%s[%i]"))(path)(i);
                const decoder = decoders[i - offset];
                const value_1 = values[i];
                result = Result_Map((v) => cons(v, acc), decoder(path_1)(value_1));
            }
        }
        return Result_Map(reverse, result);
    }
}

function makeUnion(extra, caseStrategy, t, name, path, values) {
    const uci = tryFind((x) => (name_3(x) === name), getUnionCases(t, true));
    if (uci != null) {
        const uci_1 = uci;
        const decoders = map_2((fi) => autoDecoder(extra, caseStrategy, false, fi[1]), getUnionCaseFields(uci_1));
        return Result_Map((values_2) => makeUnion_1(uci_1, toArray(values_2), true), ((decoders.length === 0) && (values.length <= 1)) ? (new FSharpResult$2(0, [empty()])) : mixedArray(1, decoders, path, values));
    }
    else {
        return new FSharpResult$2(1, [[path, new ErrorReason(6, [(("Cannot find case " + name) + " in ") + fullName_1(t)])]]);
    }
}

function autoDecodeRecordsAndUnions(extra, caseStrategy, isOptional, t) {
    let arg_1;
    const decoderRef = new FSharpRef(defaultOf());
    let extra_1;
    const matchValue = fullName_1(t);
    extra_1 = ((matchValue === "") ? extra : add(matchValue, decoderRef, extra));
    let decoder;
    if (isRecord(t, true)) {
        const decoders = map_2((fi) => [Util_Casing_convert(caseStrategy, name_3(fi)), autoDecoder(extra_1, caseStrategy, false, fi[1])], getRecordElements(t, true));
        decoder = ((path) => ((value_1) => Result_Map((xs) => makeRecord(t, toArray(xs), true), autoObject(decoders, path, value_1))));
    }
    else if (isUnion(t, true)) {
        decoder = ((path_1) => ((value_2) => {
            if (typeof value_2 === "string") {
                return makeUnion(extra_1, caseStrategy, t, value_2, path_1, []);
            }
            else if (Array.isArray(value_2)) {
                const values = value_2;
                return Result_Bind((name_2) => makeUnion(extra_1, caseStrategy, t, name_2, path_1, values), string(path_1 + "[0]", values[0]));
            }
            else {
                return new FSharpResult$2(1, [[path_1, new ErrorReason(0, ["a string or array", value_2])]]);
            }
        }));
    }
    else if (isOptional) {
        decoder = ((path_2) => ((value_3) => (new FSharpResult$2(1, [[path_2, new ErrorReason(2, ["an extra coder for " + fullName_1(t), value_3])]]))));
    }
    else {
        throw new Error((arg_1 = fullName_1(t), toText(printf("Cannot generate auto decoder for %s. Please pass an extra decoder.\n\nDocumentation available at: https://thoth-org.github.io/Thoth.Json/documentation/auto/extra-coders.html#ready-to-use-extra-coders"))(arg_1)));
    }
    decoderRef.contents = decoder;
    return decoder;
}

function autoDecoder(extra, caseStrategy, isOptional, t) {
    let decoder_13, decoder_14, decoder_15, decoder_16;
    const fullname = fullName_1(t);
    const matchValue = tryFind_1(fullname, extra);
    if (matchValue == null) {
        if (isArray(t)) {
            const decoder = autoDecoder(extra, caseStrategy, false, getElementType(t));
            return (path_1) => ((value_2) => array(uncurry2(decoder), path_1, value_2));
        }
        else if (isEnum(t)) {
            const enumType = fullName_1(getEnumUnderlyingType(t));
            switch (enumType) {
                case "System.SByte":
                    return (path_2) => ((value_4) => {
                        const t_2 = t;
                        const path_3 = path_2;
                        const value_5 = value_4;
                        const matchValue_1 = sbyte(path_3)(value_5);
                        if (matchValue_1.tag === 1) {
                            return new FSharpResult$2(1, [matchValue_1.fields[0]]);
                        }
                        else {
                            const enumValue = matchValue_1.fields[0] | 0;
                            return contains(enumValue, getEnumValues(t_2), {
                                Equals: (x, y) => (x === y),
                                GetHashCode: numberHash,
                            }) ? (new FSharpResult$2(0, [parseEnum(t_2, enumValue.toString())])) : (new FSharpResult$2(1, [[path_3, new ErrorReason(1, [fullName_1(t_2), value_5, "Unkown value provided for the enum"])]]));
                        }
                    });
                case "System.Byte":
                    return (path_4) => ((value_7) => {
                        const t_3 = t;
                        const path_5 = path_4;
                        const value_8 = value_7;
                        const matchValue_2 = byte(path_5)(value_8);
                        if (matchValue_2.tag === 1) {
                            return new FSharpResult$2(1, [matchValue_2.fields[0]]);
                        }
                        else {
                            const enumValue_1 = matchValue_2.fields[0];
                            return contains(enumValue_1, getEnumValues(t_3), {
                                Equals: (x_1, y_1) => (x_1 === y_1),
                                GetHashCode: numberHash,
                            }) ? (new FSharpResult$2(0, [parseEnum(t_3, enumValue_1.toString())])) : (new FSharpResult$2(1, [[path_5, new ErrorReason(1, [fullName_1(t_3), value_8, "Unkown value provided for the enum"])]]));
                        }
                    });
                case "System.Int16":
                    return (path_6) => ((value_10) => {
                        const t_4 = t;
                        const path_7 = path_6;
                        const value_11 = value_10;
                        const matchValue_3 = int16(path_7)(value_11);
                        if (matchValue_3.tag === 1) {
                            return new FSharpResult$2(1, [matchValue_3.fields[0]]);
                        }
                        else {
                            const enumValue_2 = matchValue_3.fields[0] | 0;
                            return contains(enumValue_2, getEnumValues(t_4), {
                                Equals: (x_2, y_2) => (x_2 === y_2),
                                GetHashCode: numberHash,
                            }) ? (new FSharpResult$2(0, [parseEnum(t_4, int16ToString(enumValue_2))])) : (new FSharpResult$2(1, [[path_7, new ErrorReason(1, [fullName_1(t_4), value_11, "Unkown value provided for the enum"])]]));
                        }
                    });
                case "System.UInt16":
                    return (path_8) => ((value_13) => {
                        const t_5 = t;
                        const path_9 = path_8;
                        const value_14 = value_13;
                        const matchValue_4 = uint16(path_9)(value_14);
                        if (matchValue_4.tag === 1) {
                            return new FSharpResult$2(1, [matchValue_4.fields[0]]);
                        }
                        else {
                            const enumValue_3 = matchValue_4.fields[0];
                            return contains(enumValue_3, getEnumValues(t_5), {
                                Equals: (x_3, y_3) => (x_3 === y_3),
                                GetHashCode: numberHash,
                            }) ? (new FSharpResult$2(0, [parseEnum(t_5, enumValue_3.toString())])) : (new FSharpResult$2(1, [[path_9, new ErrorReason(1, [fullName_1(t_5), value_14, "Unkown value provided for the enum"])]]));
                        }
                    });
                case "System.Int32":
                    return (path_10) => ((value_16) => {
                        const t_6 = t;
                        const path_11 = path_10;
                        const value_17 = value_16;
                        const matchValue_5 = int(path_11)(value_17);
                        if (matchValue_5.tag === 1) {
                            return new FSharpResult$2(1, [matchValue_5.fields[0]]);
                        }
                        else {
                            const enumValue_4 = matchValue_5.fields[0] | 0;
                            return contains(enumValue_4, getEnumValues(t_6), {
                                Equals: (x_4, y_4) => (x_4 === y_4),
                                GetHashCode: numberHash,
                            }) ? (new FSharpResult$2(0, [parseEnum(t_6, int32ToString(enumValue_4))])) : (new FSharpResult$2(1, [[path_11, new ErrorReason(1, [fullName_1(t_6), value_17, "Unkown value provided for the enum"])]]));
                        }
                    });
                case "System.UInt32":
                    return (path_12) => ((value_19) => {
                        const t_7 = t;
                        const path_13 = path_12;
                        const value_20 = value_19;
                        const matchValue_6 = uint32(path_13)(value_20);
                        if (matchValue_6.tag === 1) {
                            return new FSharpResult$2(1, [matchValue_6.fields[0]]);
                        }
                        else {
                            const enumValue_5 = matchValue_6.fields[0];
                            return contains(enumValue_5, getEnumValues(t_7), {
                                Equals: (x_5, y_5) => (x_5 === y_5),
                                GetHashCode: numberHash,
                            }) ? (new FSharpResult$2(0, [parseEnum(t_7, enumValue_5.toString())])) : (new FSharpResult$2(1, [[path_13, new ErrorReason(1, [fullName_1(t_7), value_20, "Unkown value provided for the enum"])]]));
                        }
                    });
                default: {
                    const arg_7 = fullName_1(t);
                    const clo_1 = toFail(printf("Cannot generate auto decoder for %s.\nThoth.Json.Net only support the following enum types:\n- sbyte\n- byte\n- int16\n- uint16\n- int\n- uint32\nIf you can\'t use one of these types, please pass an extra decoder.\n                    "))(arg_7);
                    return (arg_8) => {
                        const clo_2 = clo_1(arg_8);
                        return clo_2;
                    };
                }
            }
        }
        else if (isGenericType(t)) {
            if (isTuple(t)) {
                const decoders = map_2((t_8) => autoDecoder(extra, caseStrategy, false, t_8), getTupleElements(t));
                return (path_14) => ((value_21) => (Array.isArray(value_21) ? Result_Map((xs) => makeTuple(toArray(xs), t), mixedArray(0, decoders, path_14, value_21)) : (new FSharpResult$2(1, [[path_14, new ErrorReason(0, ["an array", value_21])]]))));
            }
            else {
                const fullname_1 = fullName_1(getGenericTypeDefinition(t));
                switch (fullname_1) {
                    case "Microsoft.FSharp.Core.FSharpOption`1[System.Object]":
                        return (decoder_13 = autoDecoder(extra, caseStrategy, true, getGenerics(t)[0]), (path_15) => ((value_22) => option(uncurry2(decoder_13), path_15, value_22)));
                    case "Microsoft.FSharp.Collections.FSharpList`1[System.Object]":
                        return (decoder_14 = autoDecoder(extra, caseStrategy, false, getGenerics(t)[0]), (path_16) => ((value_23) => list(uncurry2(decoder_14), path_16, value_23)));
                    case "System.Collections.Generic.IEnumerable`1[System.Object]":
                        return (decoder_15 = autoDecoder(extra, caseStrategy, false, getGenerics(t)[0]), (path_17) => ((value_24) => seq(uncurry2(decoder_15), path_17, value_24)));
                    case "Microsoft.FSharp.Collections.FSharpMap`2[System.Object,System.Object]": {
                        const keyDecoder = autoDecoder(extra, caseStrategy, false, getGenerics(t)[0]);
                        const valueDecoder = autoDecoder(extra, caseStrategy, false, getGenerics(t)[1]);
                        let d_20;
                        const decoders_1 = ofArray([(path_18) => ((value_25) => autoObject2(uncurry2(keyDecoder), uncurry2(valueDecoder), path_18, value_25)), (decoder_16 = tuple2(uncurry2(keyDecoder), uncurry2(valueDecoder)), (path_19) => ((value_26) => list(uncurry2(decoder_16), path_19, value_26)))]);
                        d_20 = ((path_20) => ((value_27) => oneOf(decoders_1, path_20, value_27)));
                        return (path_21) => ((value_29) => map(toMap, uncurry2(d_20), path_21, value_29));
                    }
                    case "Microsoft.FSharp.Collections.FSharpSet`1[System.Object]": {
                        const decoder_17 = autoDecoder(extra, caseStrategy, false, getGenerics(t)[0]);
                        return (path_22) => ((value_30) => {
                            const matchValue_7 = array(uncurry2(decoder_17), path_22, value_30);
                            return (matchValue_7.tag === 0) ? (new FSharpResult$2(0, [toSet(matchValue_7.fields[0])])) : (new FSharpResult$2(1, [matchValue_7.fields[0]]));
                        });
                    }
                    default:
                        return autoDecodeRecordsAndUnions(extra, caseStrategy, isOptional, t);
                }
            }
        }
        else {
            switch (fullname) {
                case "System.Boolean":
                    return (path_23) => ((value_32) => bool(path_23, value_32));
                case "Microsoft.FSharp.Core.Unit":
                    return (path_24) => ((value_33) => unit(path_24, value_33));
                case "System.String":
                    return (path_25) => ((value_34) => string(path_25, value_34));
                case "System.Char":
                    return (path_26) => ((value_35) => char(path_26, value_35));
                case "System.SByte":
                    return sbyte;
                case "System.Byte":
                    return byte;
                case "System.Int16":
                    return int16;
                case "System.UInt16":
                    return uint16;
                case "System.Int32":
                    return int;
                case "System.UInt32":
                    return uint32;
                case "System.Double":
                    return (path_27) => ((value_36) => float(path_27, value_36));
                case "System.Single":
                    return (path_28) => ((value_37) => float32(path_28, value_37));
                case "System.DateTime":
                    return (path_29) => ((value_38) => datetimeUtc(path_29, value_38));
                case "System.DateTimeOffset":
                    return (path_30) => ((value_39) => datetimeOffset(path_30, value_39));
                case "System.TimeSpan":
                    return (path_31) => ((value_40) => timespan(path_31, value_40));
                case "System.Guid":
                    return (path_32) => ((value_41) => guid(path_32, value_41));
                case "System.Object":
                    return (_arg_6) => ((v) => (new FSharpResult$2(0, [v])));
                default:
                    return autoDecodeRecordsAndUnions(extra, caseStrategy, isOptional, t);
            }
        }
    }
    else {
        const decoderRef = matchValue;
        return (path) => ((value_1) => decoderRef.contents(path)(value_1));
    }
}

function makeExtra(extra) {
    if (extra != null) {
        return map_3((_arg, tupledArg) => (new FSharpRef(tupledArg[1])), extra.Coders);
    }
    else {
        return empty_1({
            Compare: comparePrimitives,
        });
    }
}

export class Auto {
    constructor() {
    }
}

export function Auto_$reflection() {
    return class_type("Thoth.Json.Decode.Auto", void 0, Auto);
}

export function Auto_generateBoxedDecoderCached_Z6670B51(t, caseStrategy, extra) {
    let y_1, y;
    const caseStrategy_1 = defaultArg(caseStrategy, new CaseStrategy(0, []));
    return Util_Cache$1__GetOrAdd_43981464(Util_CachedDecoders, (y_1 = ((y = fullName_1(t), toString_12(caseStrategy_1) + y)), defaultArg(map_4((e) => e.Hash, extra), "") + y_1), () => autoDecoder(makeExtra(extra), caseStrategy_1, false, t));
}

export function Auto_generateBoxedDecoder_Z6670B51(t, caseStrategy, extra) {
    const caseStrategy_1 = defaultArg(caseStrategy, new CaseStrategy(0, []));
    return autoDecoder(makeExtra(extra), caseStrategy_1, false, t);
}

