const { ownerQuiz, withoutOwnerQuiz } = require("../models/quiz_model");

//creating quizess

exports.createQuiz = async (req, res) => {
  const quiz = new ownerQuiz({
    ...req.body,
    owner: req.user._id,
  });

  try {
    const returnedQuiz = await quiz.save();
    res.status(201).send(returnedQuiz);
  } catch (err) {
    res.status(400).send({ err });
  }
};

//querying single quiz

exports.getSingleQuiz = async (req, res) => {
  try {
    const quiz = await ownerQuiz.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!quiz)
      res.status(404).send("couldn't find the quiz you want to update");
    else {
      res.status(200).send(quiz);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

//quering quizess

exports.queryingQuiz = async (req, res) => {
  try {
    //const quizess = await ownerQuiz.find({owner : req.user._id});
    const quizess = await req.user
      .populate({
        path: "quiz",
        match: {},
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
        },
      })
      .execPopulate();

    res.status(200).send({ mass_quizess: quizess.quiz });
  } catch (err) {
    res.status(400).send({ err });
  }
};
//update any quiz
exports.updateQuiz = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["question", "options", "answer", "tag"];
  const isOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isOperation) res.status(404).send("invalid updates!!!!");

  try {
    const quiz = await ownerQuiz.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    updates.forEach((update) => (quiz[update] = req.body[update]));
    await quiz.save();
    res.status(200).send(quiz);
  } catch (err) {
    res.status(500).send({
      operation: "couldn't update the quiz",
    });
  }
};

//delete the quiz

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await ownerQuiz.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!quiz) res.status(404).send("couldn't find and delete");
    else {
      res.status(200).send(quiz);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

//delete all quizess

exports.deleteAllQuizes = async (req, res) => {
  try {
    await ownerQuiz.deleteMany({ owner: req.user._id });
    res.status(200).send({
      operation: "All quizess are deleted successfully",
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

//inserting mass_quizess physics

exports.insertMassQuizess = async (req, res) => {
  const quizess = ownerQuiz.insertMassQuizess();

  try {
    for (let quiz of quizess) {
      let onSave = new ownerQuiz(quiz);
      await onSave.save();
    }
    res.status(201).send(quizess);
  } catch (err) {
    res.status(400).send({
      operation: "couldn't insertMassQuizess",
    });
  }
};

//fetching mass_quizess

exports.fetchMassQuizess = async (req, res) => {
  try {
    const mass_quizess = await ownerQuiz.find({});
    res.status(200).send({ mass_quizess });
  } catch (err) {
    res.status(500).send({
      operation: "couldn't fetch mass_quizess",
    });
  }
};

//physicsQuiz

exports.queringPhysicsQuiz = async (req, res) => {
  try {
    const mass_quizess = await ownerQuiz.find({ tag: "physics" });
    res.status(200).send({ mass_quizess });
  } catch (err) {
    res.status(500).send({
      operation: "couldn't fetch mass_quizess",
    });
  }
};

//cs

exports.queryingCsQuiz = async (req, res) => {
  try {
    const mass_quizess = await ownerQuiz.find({ tag: "cs" });
    res.status(200).send({ mass_quizess });
  } catch (err) {
    res.status(500).send({
      operation: "couldn't fetch mass_quizess",
    });
  }
};

//gi

exports.queringGiQuiz = async (req, res) => {
  try {
    const mass_quizess = await ownerQuiz.find({ tag: "gi" });
    res.status(200).send({ mass_quizess });
  } catch (err) {
    res.status(500).send({
      operation: "couldn't fetch mass_quizess",
    });
  }
};

//other
exports.queringOtherQuiz = async (req, res) => {
  try {
    const mass_quizess = await ownerQuiz.find({
      tag: { $nin: ["cs", "physics", "gi"] },
    });
    res.status(200).send({ mass_quizess });
  } catch (err) {
    res.status(500).send({
      operation: "couldn't fetch mass_quizess",
    });
  }
};

//quiz displaying routes physics

exports.displayPhysicsQuiz = async (req, res) => {
  try {
    const mass_quizess = await ownerQuiz.paginate(
      { tag: "physics" },
      { offset: parseInt(req.query.skip), limit: parseInt(req.query.limit) }
    );
    res.status(200).send({ mass_quizess });
  } catch (err) {
    res.status(500).send({
      operation: "couldn't fetch mass_quizess",
    });
  }
};

//quiz displaying routes cs
exports.displayCsQuiz = async (req, res) => {
  try {
    const mass_quizess = await ownerQuiz.paginate(
      { tag: "cs" },
      { offset: parseInt(req.query.skip), limit: parseInt(req.query.limit) }
    );
    res.status(200).send({ mass_quizess });
  } catch (err) {
    res.status(500).send({
      operation: "couldn't fetch mass_quizess",
    });
  }
};

//quiz displaying routes gi

exports.displayGiQuiz = async (req, res) => {
  try {
    const mass_quizess = await ownerQuiz.paginate(
      { tag: "gi" },
      { offset: parseInt(req.query.skip), limit: parseInt(req.query.limit) }
    );
    res.status(200).send({ mass_quizess });
  } catch (err) {
    res.status(500).send({
      operation: "couldn't fetch mass_quizess",
    });
  }
};

//quiz displaying routes other

exports.displayOtherQuiz = async (req, res) => {
  try {
    const mass_quizess = await ownerQuiz.paginate(
      { tag: { $nin: ["cs", "physics", "gi"] } },
      { offset: parseInt(req.query.skip), limit: parseInt(req.query.limit) }
    );
    res.status(200).send({ mass_quizess });
  } catch (err) {
    res.status(500).send({
      operation: "couldn't fetch mass_quizess",
    });
  }
};
