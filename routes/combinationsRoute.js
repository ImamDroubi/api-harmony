const express = require("express");
const { verifyToken, verifyAdmin ,verifyUser } = require("../utilities/verifyRequest");
const { createCombination, getAllCombinations, getCombination, getUserCombinations, getAllPublicCombinations, getUserPublicCombinations, updateCombination, deleteCombination } = require("../controllers/combinationsController");
const {verifyTracks} = require("../utilities/verifyTracks");

const router = express.Router();

router.post("/" ,verifyToken,verifyTracks,createCombination);
router.get("/" , verifyAdmin, getAllCombinations);
router.get("/combination/:id",verifyToken,getCombination);
router.get("/user/:id" ,verifyUser,getUserCombinations);
router.get("/public" , getAllPublicCombinations);
router.get("/public/user/:id" , getUserPublicCombinations);
router.patch("/:id" ,verifyToken,verifyTracks, updateCombination);
router.delete("/:id" ,verifyToken, deleteCombination);

module.exports = router;