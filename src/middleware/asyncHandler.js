"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @desc - Avoud the problem of try catch not automatically passed to asynchnronous threads
 * @param fn The asynchronous function to wrap async functions
 * @returns A function that executes the async function and catechs the error
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.default = asyncHandler;
