const Sauce = require("../models/sauce");
const user = require("../models/user");

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.addSauce = (req, res, next) => {
  // console.log(req.body.sauce);
  // console.log(typeof req.body.sauce);
  req.body.sauce = JSON.parse(req.body.sauce);
  console.log("sauce after parse", req.body.sauce);
  const url = req.protocol + "://" + req.get("host");
  console.log("req.auth", req.auth);
  const sauce = new Sauce({
    // _id: req.body.sauce._id,
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    heat: req.body.sauce.heat,
    mainPepper: req.body.sauce.mainPepper,
    imageUrl: url + "/assets/" + req.file.filename,
    dislikes: 0,
    likes: 0,
    userId: req.auth.userId,
  });
  console.log("sauce:", sauce);
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Post saved successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getSingleSauces = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauces) => {
      res.status(200).json(sauces);
      // console.log(sauces._id);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
      _id: req.params._id,
      name: req.body.sauce.name,
      manufacturer: req.body.sauce.manufacturer,
      description: req.body.sauce.description,
      heat: req.body.sauce.heat,
      mainPepper: req.body.sauce.mainPepper,
      imageUrl: url + "/assets/" + req.file.filename,
      dislikes: 0,
      likes: 0,
    };
  } else {
    sauce = {
      _id: req.params._id,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      heat: req.body.heat,
      mainPepper: req.body.mainPepper,
      imageUrl: req.body.imageUrl,
      dislikes: 0,
      likes: 0,
    };
  }
  // console.log("Id", req.body);
  // req.body.sauce = JSON.parse(req.body.sauce);
  Sauce.updateOne({ _id: req.params.id }, sauce)
    .then(() => {
      res.status(201).json({
        message: "Sauce updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
