"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.percentSchema = exports.positiveInteger = exports.optionalAscentYear = exports.timeframeSchema = exports.timeframes = exports.errorSchema = void 0;
var zod_1 = require("zod");
exports.errorSchema = zod_1.z.object({ error: zod_1.z.string() });
exports.timeframes = ['year', 'last-12-months', 'all-time'];
exports.timeframeSchema = zod_1.z.enum(exports.timeframes);
exports.optionalAscentYear = zod_1.z
    .number()
    .int()
    .min(1900, 'Year of ascent must be 1900 or later')
    .optional();
exports.positiveInteger = zod_1.z.number().int().min(0);
exports.percentSchema = zod_1.z.number().int().min(0).max(100);
