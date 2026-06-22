"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addressController_1 = require("../controllers/addressController");
const auth_1 = require("../middleware/auth");
const validate_1 = __importDefault(require("../middleware/validate"));
const address_1 = require("../validation/address");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
router.get("/", addressController_1.getAddresses);
router.post("/", (0, validate_1.default)(address_1.createAddressSchema), addressController_1.createAddress);
router.get("/:id", addressController_1.getAddress);
router.put("/:id", (0, validate_1.default)(address_1.updateAddressSchema), addressController_1.updateAddress);
router.patch("/:id/default", addressController_1.setDefaultAddress);
router.delete("/:id", addressController_1.removeAddress);
exports.default = router;
