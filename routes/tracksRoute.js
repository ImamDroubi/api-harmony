const express = require("express");
const { createTrack, getAllTracks, getAllPublicTracks, getUserPublicTracks, getUserTracks, getTrack, updateTrack, deleteTrack, getTracks } = require("../controllers/tracksController");
const { verifyToken, verifyAdmin ,verifyUser, checkIfTokenExists } = require("../utilities/verifyRequest");

const router = express.Router();

router.post("/" ,verifyToken,createTrack);
router.get("/" , verifyAdmin, getAllTracks);
router.get("/multiple" , verifyToken, getTracks);
router.get("/track/:id",verifyToken,getTrack);
router.get("/user/:id" ,verifyUser,getUserTracks);
router.get("/public/:category",checkIfTokenExists , getAllPublicTracks);
router.get("/public/user/:id",checkIfTokenExists, getUserPublicTracks);
router.patch("/:id" ,verifyToken, updateTrack);
router.delete("/:id" ,verifyToken, deleteTrack);

module.exports = router;