"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roleController_1 = require("../controllers/roleController");
const validate_1 = __importDefault(require("../middleware/validate"));
const role_1 = require("../validation/role");
const router = (0, express_1.Router)();
router.get("/", roleController_1.getRoles);
router.post("/", (0, validate_1.default)(role_1.createRoleSchema), roleController_1.createRole);
router.get("/:id", roleController_1.getRole);
router.put("/:id", (0, validate_1.default)(role_1.updateRoleSchema), roleController_1.updateRole);
router.delete("/:id", roleController_1.removeRole);
exports.default = router;
