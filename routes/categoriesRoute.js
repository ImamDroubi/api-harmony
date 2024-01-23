const express = require("express");
const { verifyToken, verifyAdmin ,verifyUser } = require("../utilities/verifyRequest");
const { createCategory, getAllCategories, getUserCategories, deleteCategory, getMyCategories } = require("../controllers/categoriesController");

const router = express.Router();

router.post("/" ,verifyAdmin, createCategory);
router.get("/" , getAllCategories);
router.get("/my" ,verifyToken, getMyCategories);
router.get("/user/:id" , getUserCategories);
router.delete("/:id" ,verifyAdmin, deleteCategory);

module.exports = router;