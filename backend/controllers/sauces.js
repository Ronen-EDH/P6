const Sauce = require("../models/sauce");
const fs = require("fs");

// getFilesInDirectory();

// function getFilesInDirectory() {
//   console.log("\nFiles present in directory:");
//   let files = fs.readdirSync("./assets");
//   files.forEach((file) => {
//     console.log(file);
//   });
// }

// fs.unlink("./assets/yulia-khlebnikova-EZlAKT3x3pg-unsplash1675431300039.jpg", (err) => {
//   if (err) console.log(err);
//   else {
//     console.log("\nDeleted file: example_file.txt");

//     // Get the files in current directory
//     // after deletion
//     getFilesInDirectory();
//   }
// });

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
  // console.log("sauce after parse", req.body.sauce);
  const url = req.protocol + "://" + req.get("host");
  // console.log("req.auth", req.auth);
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
  // console.log("sauce:", sauce);
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
  // console.log(req.params);
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauces) => {
      res.status(200).json(sauces);
      // console.log(sauces.imageUrl);
      // const filename = sauces.imageUrl.split("/assets/")[1];
      // console.log(filename);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params._id });
  // console.log("name", nameOfFile);
  if (req.file) {
    Sauce.findOne({
      _id: req.params.id,
    })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/assets/")[1];
        fs.unlink("assets/" + filename, (err) => {
          if (err) console.log(err);
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
    const url = req.protocol + "://" + req.get("host");
    req.body.sauce = JSON.parse(req.body.sauce);
    // console.log("req.params", req.params);
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
      usersLiked: [],
      usersDisliked: [],
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
      usersLiked: [],
      usersDisliked: [],
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

exports.deleteSauce = (req, res, next) => {
  // why "_id: req.params.id" and not just "req.params.id" ?
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/assets/")[1];
      fs.unlink("assets/" + filename, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(201).json({
              message: "Deleted!",
            });
          })
          .catch((error) => {
            res.status(400).json({
              error: error,
            });
          });
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.likeDislikeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const likeFound = sauce.usersLiked.find((element) => element === req.body.userId);
    const dislikeFound = sauce.usersDisliked.find((element) => element === req.body.userId);
    if (req.body.like === 1) {
      // console.log("req.body for likes&dislikes :", req.body);
      // console.log(sauce);
      // console.log(likeFound);
      sauce.usersLiked.push(req.body.userId);
      sauce.likes += 1;
      sauce
        .save()
        .then(() => {
          res.status(200).json({
            message: "Like added!",
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
      // return res.status(200).json({
      //   messege: "Like added",
      // });
      // sauce.usersLiked.push(req.body.userId);
    }
    if (req.body.like === 0) {
      // console.log("req.body for likes&dislikes :", req.body);
      // console.log(sauce);
      // console.log(likeFound);
      if (likeFound) {
        const index = sauce.usersLiked.indexOf(req.body.userId);
        if (index > -1) {
          sauce.usersLiked.splice(index, 1);
          // console.log("If check works!");
          sauce.likes -= 1;
          sauce
            .save()
            .then(() => {
              res.status(200).json({
                message: "Like removed!",
              });
            })
            .catch((error) => {
              res.status(400).json({
                error: error,
              });
            });
        }
      }
      if (dislikeFound) {
        const index = sauce.usersDisliked.indexOf(req.body.userId);
        if (index > -1) {
          sauce.usersDisliked.splice(index, 1);
          // console.log("If check works!");
          sauce.dislikes -= 1;
          sauce
            .save()
            .then(() => {
              res.status(200).json({
                message: "Dislike removed!",
              });
            })
            .catch((error) => {
              res.status(400).json({
                error: error,
              });
            });
        }
      }
      // console.log("index:", index);
      // console.log("sauce.usersLiked:", sauce.usersLiked);
    }
    if (req.body.like === -1) {
      sauce.usersDisliked.push(req.body.userId);
      sauce.dislikes += 1;
      sauce
        .save()
        .then(() => {
          res.status(200).json({
            message: "Disike added!",
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    }
  });
};
