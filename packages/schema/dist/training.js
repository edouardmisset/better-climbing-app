"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainingSessionSchema = exports.LOAD_CATEGORIES = exports.ENERGY_SYSTEMS = exports.ANATOMICAL_REGIONS = exports.SESSION_TYPES = void 0;
exports.fromSessionTypeToLabel = fromSessionTypeToLabel;
exports.fromAnatomicalRegionToLabel = fromAnatomicalRegionToLabel;
exports.fromEnergySystemToLabel = fromEnergySystemToLabel;
var zod_1 = require("zod");
var ascent_1 = require("./ascent");
var generic_1 = require("./generic");
exports.SESSION_TYPES = [
    'Out',
    'En',
    'PE',
    'SE',
    'MS',
    'Po',
    'CS',
    'Ta',
    'St',
    'Sk',
    'Ro',
    'Sg',
    'Co',
    'FB',
];
var SESSION_TYPES_TO_TEXT = {
    Out: 'Outdoor',
    En: 'Endurance',
    PE: 'Power Endurance',
    SE: 'Strength Endurance',
    MS: 'Max Strength',
    Po: 'Power',
    CS: 'Contact Strength',
    Ta: 'Tapper',
    St: 'Stamina',
    Sk: 'Skill',
    Ro: 'Routine',
    Sg: 'Stretching',
    Co: 'Core',
    FB: 'Finger Boarding',
};
function fromSessionTypeToLabel(sessionType) {
    return SESSION_TYPES_TO_TEXT[sessionType];
}
exports.ANATOMICAL_REGIONS = ['Ar', 'Fi', 'Ge'];
var ANATOMICAL_REGIONS_TO_TEXT = {
    Ar: 'Arms',
    Fi: 'Fingers',
    Ge: 'General',
};
function fromAnatomicalRegionToLabel(anatomicalRegion) {
    return ANATOMICAL_REGIONS_TO_TEXT[anatomicalRegion];
}
exports.ENERGY_SYSTEMS = ['AA', 'AL', 'AE'];
var ENERGY_SYSTEMS_TO_TEXT = {
    AA: 'Anaerobic Alactic',
    AL: 'Anaerobic Lactic',
    AE: 'Aerobic',
};
function fromEnergySystemToLabel(energySystem) {
    return ENERGY_SYSTEMS_TO_TEXT[energySystem];
}
exports.LOAD_CATEGORIES = ['High', 'Medium', 'Low'];
var sessionTypeSchema = zod_1.z.enum(exports.SESSION_TYPES);
var energySystemSchema = zod_1.z.enum(exports.ENERGY_SYSTEMS);
var anatomicalRegionSchema = zod_1.z.enum(exports.ANATOMICAL_REGIONS);
exports.trainingSessionSchema = zod_1.z.object({
    anatomicalRegion: anatomicalRegionSchema.optional(),
    climbingDiscipline: ascent_1.climbingDisciplineSchema.optional(),
    comments: zod_1.z.string().optional(),
    date: zod_1.z.string(),
    energySystem: energySystemSchema.optional(),
    gymCrag: zod_1.z.string().optional(),
    intensity: generic_1.percentSchema.optional(),
    load: generic_1.percentSchema.optional(),
    sessionType: sessionTypeSchema.optional(),
    volume: generic_1.percentSchema.optional(),
    id: generic_1.positiveInteger,
});
