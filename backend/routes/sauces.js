const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const sauceCtrl = require("../controllers/sauces");

router.get("/", auth, sauceCtrl.getAllSauces);
router.post("/", auth, multer, sauceCtrl.addSauce);
router.get("/:id", auth, sauceCtrl.getSingleSauces);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

module.exports = router;
