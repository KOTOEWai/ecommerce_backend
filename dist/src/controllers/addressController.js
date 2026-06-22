"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAddress = exports.setDefaultAddress = exports.updateAddress = exports.createAddress = exports.getAddress = exports.getAddresses = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const customError_1 = require("../utils/customError");
const addressService = __importStar(require("../services/addressService"));
const getParamId = (id) => {
    if (Array.isArray(id))
        return id[0];
    return id;
};
const getUserId = (req) => {
    if (!req.userId)
        throw new customError_1.AppError("unauthorized", 401);
    return req.userId;
};
exports.getAddresses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = getUserId(req);
    const addresses = await addressService.listAddresses(userId);
    res.success(addresses, "get addresses successfully", 200);
});
exports.getAddress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = getUserId(req);
    const id = getParamId(req.params.id);
    const address = await addressService.findAddressById(userId, id);
    if (!address)
        throw new customError_1.AppError("address not found", 404);
    res.success(address, "get address successfully", 200);
});
exports.createAddress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = getUserId(req);
    const address = await addressService.createAddress(userId, req.body);
    res.success(address, "address created successfully", 201);
});
exports.updateAddress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = getUserId(req);
    const id = getParamId(req.params.id);
    const address = await addressService.updateAddress(userId, id, req.body);
    res.success(address, "address updated successfully", 200);
});
exports.setDefaultAddress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = getUserId(req);
    const id = getParamId(req.params.id);
    const address = await addressService.setDefaultAddress(userId, id);
    res.success(address, "default address updated successfully", 200);
});
exports.removeAddress = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = getUserId(req);
    const id = getParamId(req.params.id);
    await addressService.deleteAddress(userId, id);
    res.success({ id }, "address deleted successfully", 200);
});
