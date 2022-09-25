const express = require("express");
const router = express.Router();

//=====================Importing controllers========================
const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController");
const mw = require("../middleware/auth");

//.............test api........................
router.get("/test-me", function (req, res) {
  res.send({ msg: "working properly" });
});

//======================USER APIS===============================
//.....................Post api createUser......................
router.post("/register", userController.createUser);
//.....................Post api loginUser........................
router.post("/login", userController.createLogin);
//=====================❌❌❌❌❌❌❌❌=========================

//======================BOOK APIS=================================
//.....................Post api createBook.........................
router.post("/books", mw.auth, bookController.createbook);
//..................get api getBooks by query params.....................
router.get("/books", mw.auth, bookController.getBookByQuery);
//..................get api getBooks by path params......................
router.get("/books/:bookId", mw.auth,bookController.getBooksDetails);
//....................put api update Book..........................
router.put("/books/:bookId", mw.auth, bookController.updatebook);
//....................delete api deleteBook.........................
router.delete("/books/:bookId", mw.auth, bookController.deleteBook);
//=====================❌❌❌❌❌❌❌❌=========================

//======================REVIEW APIS===================================
//....................Post api createReview..........................
router.post("/books/:bookId/review", reviewController.createreview);
//....................Put api updateReview...........................
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview);
//....................delete api deleteReview........................
router.delete( "/books/:bookId/review/:reviewId",reviewController.deleteReviewsById);
//=====================❌❌❌❌❌❌❌❌=========================================

//............IF THERE IS NO ID IN THE PATH PARAMS SO THIS API SEND A ERROR MESSAGE....
router.all("/*", function (req, res) {
  res
    .status(404)
    .send({ status: false, msg: "please provide Id in path param" });
});

module.exports = router;
