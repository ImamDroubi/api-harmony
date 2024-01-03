const express = require("express");
const { verifyToken, verifyAdmin ,verifyUser } = require("../utilities/verifyRequest");
const {toggleLikeTrack,toggleLikeCombination, getTrackLikes, getCombinationLikes} = require("../controllers/likesController");
const router = express.Router();

router.get("/track/:id" ,verifyToken, getTrackLikes);
router.get("/combination/:id" ,verifyToken, getCombinationLikes);
router.post("/track/:id" ,verifyToken, toggleLikeTrack);
router.post("/combination/:id" ,verifyToken, toggleLikeCombination);

module.exports = router;