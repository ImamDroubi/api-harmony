const express = require("express");
const { createTrack, getAllTracks, getAllPublicTracks, getUserPublicTracks, getUserTracks, getTrack, updateTrack, deleteTrack } = require("../controllers/tracksController");
const { verifyToken, verifyAdmin ,verifyUser } = require("../utilities/verifyRequest");

const router = express.Router();

router.post("/" ,verifyToken,createTrack);
router.get("/" , verifyAdmin, getAllTracks);
router.get("/track/:id",verifyToken,getTrack);
router.get("/user/:id" ,verifyUser,getUserTracks);
router.get("/public" , getAllPublicTracks);
router.get("/public/user/:id" , getUserPublicTracks);
router.patch("/:id" ,verifyToken, updateTrack);
router.delete("/:id" ,verifyToken, deleteTrack);

module.exports = router;