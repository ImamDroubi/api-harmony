const express = require("express");
const { verifyToken, verifyAdmin ,verifyUser, checkIfTokenExists } = require("../utilities/verifyRequest");
const { getAllUsers, getUser, updateUser, deleteUser, grantAdmin, revokeAdmin, updatePassword,getFollowersCount, toggleFollowUser, getUserExtended } = require("../controllers/usersController");

const router = express.Router();

router.get("/" ,verifyAdmin, getAllUsers);
router.get("/user/:id" ,getUser);
router.get("/user/extended/:id", checkIfTokenExists,getUserExtended);
router.get("/followers/:id" ,getFollowersCount);
router.post("/followers/:id",verifyToken ,toggleFollowUser);
router.patch("/:id" ,verifyUser, updateUser);
router.patch("/password/:id" ,verifyUser, updatePassword);
router.patch("/admin/:id" ,verifyAdmin, grantAdmin);
router.patch("/admin/revoke/:id" ,verifyAdmin, revokeAdmin);
router.delete("/:id" ,verifyUser, deleteUser);

module.exports = router;