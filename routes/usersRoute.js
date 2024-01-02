const express = require("express");
const { verifyToken, verifyAdmin ,verifyUser } = require("../utilities/verifyRequest");
const { getAllUsers, getUser, updateUser, deleteUser, grantAdmin, revokeAdmin, updatePassword } = require("../controllers/usersController");

const router = express.Router();

router.get("/" ,verifyAdmin, getAllUsers);
router.get("/user/:id" ,getUser);
router.patch("/:id" ,verifyUser, updateUser);
router.patch("/password/:id" ,verifyUser, updatePassword);
router.patch("/admin/:id" ,verifyAdmin, grantAdmin);
router.patch("/admin/revoke/:id" ,verifyAdmin, revokeAdmin);
router.delete("/:id" ,verifyUser, deleteUser);

module.exports = router;