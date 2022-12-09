const express = require("express");
const { models } = require("mongoose");
const router = express.Router(); // import router
const fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//fetchAllnote route for user : login required
router.get("/fetchAllnote", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json({Success:true,notes:notes});
  } catch (error) {
    res.status(500).send({Success:false, error: "Some error occured with fetch notes" });
  }
});

//route for Add note by user in the database:login required
router.post(
  "/addNote",
  fetchUser,
  [
    body("title", "Enter valid title with min atleast 3 char.").isLength({
      min: 3,
    }),
    body(
      "description",
      "Enter valid description with min atleast 5 char."
    ).isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const note = new Note({
        user: req.user.id,
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
      });
      const saveNote = await note.save();
      res.json({Success:true,note:note});
    } catch (error) {
      console.log(error);
      res.status(500).send({Success:false, error: "internal server error" });
    }
  }
);
// route for Update note : login required
router.put("/updateNote/:id", fetchUser, async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }
      let note = await Note.findById(req.params.id); //for find note
      if (!note) {
        return res.status(401).json({Success:false, error: "Not found" });
      }
      if (note.user.toString() != req.user.id) {
        return res.status(401).json({Success:false, error: "Not Allowed" });
      }
      note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      ); //for update
      res.json({Success:true,note:note});
    } catch (error) {
      console.log(error);
      res.status(500).send({Success:false, error: "internal server error" });
    }
  });

// route for delete note : login required
router.delete("/deleteNote/:id", fetchUser, async (req, res) => {
    try {
      let note = await Note.findById(req.params.id); //for find note
      if (!note) {
        return res.status(401).json({Success:false, error: "Not found" });
      }
      if (note.user.toString() != req.user.id) {
        return res.status(401).json({Success:false, error: "Not Allowed" });
      }
      note= await Note.findByIdAndDelete(req.params.id);
      res.json({Success:true,note:note});
    } catch (error) {
      console.log(error);
      res.status(500).send({Success:false, error: "internal server error" });
    }
  });
module.exports = router;
