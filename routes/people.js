//DEPENDENCIES
import express from "express";
//MODELS
import Person from "../models/Person.js";

//MIDDLEWARE
import checkHeader from "../middleware/checkHeader.js";
import sanitize from "../middleware/sanitize.js";
import auth from "../middleware/auth.js";
import validateId from "../middleware/validateID.js";
import validateAccess from "../middleware/validateAccess.js";
import allowDelete from "../middleware/allowDelete.js";

//HELPER FUNCTIONS
import formatResponseData from "../helperFunctions/formatResponseData.js";
import log from "../startup/logger.js";

//ROUTES
const router = express.Router();

router.get("/", checkHeader, auth, async (req, res) => {
  //show only persons that were created by the user
  const people = await Person.find()
    .or([{ owner: req.user._id }, { sharedWith: req.user._id }])
    .select("-gifts");
  res
    .status(201)
    .json(people.map((person) => formatResponseData(person, "people")));
});

router.get(
  "/:id",
  checkHeader,
  auth,
  validateId,
  validateAccess,
  async (req, res, next) => {
    const personId = req.params.id;
    try {
      const person = await Person.findById(personId);
      res.json(formatResponseData(person, "people"));
    } catch (err) {
      log.error(err);
      next(err);
    }
  }
);

router.post("/", checkHeader, auth, sanitize, async (req, res, next) => {
  const newPerson = new Person(req.sanitizedBody);
  newPerson.owner = req.user._id;
  try {
    await newPerson.save();
    res.status(201).json(formatResponseData(newPerson, "people"));
  } catch (err) {
    log.error(err);
    next(err);
  }
});

router.patch(
  "/:id",
  checkHeader,
  auth,
  sanitize,
  validateId,
  validateAccess,
  async (req, res, next) => {
    const personId = req.params.id;
    try {
      const object = await Person.findByIdAndUpdate(
        personId,
        req.sanitizedBody,
        { new: true, overwrite: false, runValidators: true }
      );
      res.json(formatResponseData(object, "people"));
    } catch (err) {
      log.error(err);
      next(err);
    }
  }
);

router.put(
  "/:id",
  checkHeader,
  auth,
  sanitize,
  validateId,
  validateAccess,
  async (req, res, next) => {
    const personId = req.params.id;
    const userId = req.user._id;
    try {
      const object = await Person.findByIdAndUpdate(
        personId,
        { owner: userId, ...req.sanitizedBody },
        { new: true, overwrite: true, runValidators: true }
      );
      res.json(formatResponseData(object, "people"));
    } catch (err) {
      log.error(err);
      next(err);
    }
  }
);

router.delete(
  "/:id",
  checkHeader,
  auth,
  validateId,
  allowDelete,
  async (req, res, next) => {
    const personId = req.params.id;
    try {
      const person = await Person.findByIdAndRemove(personId);
      res.json(formatResponseData(person, "people"));
    } catch (err) {
      log.error(err);
      next(err);
    }
  }
);

export default router;
