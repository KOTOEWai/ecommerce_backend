import { Router } from "express";
import {
  createAddress,
  getAddress,
  getAddresses,
  removeAddress,
  setDefaultAddress,
  updateAddress,
} from "../controllers/addressController";
import { protect } from "../middleware/auth";
import validateBody from "../middleware/validate";
import { createAddressSchema, updateAddressSchema } from "../validation/address";

const router = Router();

router.use(protect);

router.get("/", getAddresses);
router.post("/", validateBody(createAddressSchema), createAddress);
router.get("/:id", getAddress);
router.put("/:id", validateBody(updateAddressSchema), updateAddress);
router.patch("/:id/default", setDefaultAddress);
router.delete("/:id", removeAddress);

export default router;
