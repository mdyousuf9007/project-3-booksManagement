const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController");
const mw = require("../middleware/auth");

//.............test api........................
router.get("/test-me", function (req, res) {
  res.send({ msg: "working properly" });
});
//.............project apis..............................
router.post("/register",userController.createUser);
router.post("/login",userController.createLogin);
router.post("/books",bookController.createbook);
router.get("/books",bookController.getBookByQuery);
router.get("/books/:bookId",bookController.getBooksDetails);
router.put("/books/:bookId",bookController.updatebook);
router.delete("/books/:bookId",mw.auth,bookController.deleteBook);
router.post("/books/:bookId/review", mw.auth, reviewController.updateReview);
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview);
router.delete("/books/:bookId/review/:reviewId", mw.auth, reviewController.deleteReviewsById);


// router.all("/*", function (req, res) {         
//   res.status(400).send({
//       status: false,
//       msg: "The api request is not available"
//   })
// })

module.exports = router;
