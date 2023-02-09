const Sauce = require("../models/sauce");
const fs = require("fs");

/** This function is responsible for saving the sauce object to the database. */
function saveToDatabase(sauce, res, message) {
  sauce
    .save()
    .then(() => {
      res.status(200).json({
        message: message,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
}

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
  req.body.sauce = JSON.parse(req.body.sauce);
  const url = req.protocol + "://" + req.get("host");
  const sauce = new Sauce({
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
  saveToDatabase(sauce, res, "Post saved successfully!");
  /*   sauce
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
    }); */
};

exports.getSingleSauces = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

/** This function handles modification of selected sauce.
 *  Check first if it's the right extension, if so check if there is a new image file being uploaded(if so, delete previous image).
 *  Than rewrites the sauce info/data and saves it to the database. */
exports.modifySauce = (req, res, next) => {
  if (req.fileValidationError) {
    return res.status(400).json({ message: req.fileValidationError });
  }
  // console.log("modifySauce runs");
  let sauce = new Sauce({ _id: req.params._id });
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
    req.body.sauce.imageUrl = url + "/assets/" + req.file.filename;
  } else {
    req.body.sauce = req.body;
  }
  sauce = {
    _id: req.params._id,
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    heat: req.body.sauce.heat,
    mainPepper: req.body.sauce.mainPepper,
    imageUrl: req.body.sauce.imageUrl,
    dislikes: 0,
    likes: 0,
    usersLiked: [],
    usersDisliked: [],
  };

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

/** This function handles the deletion of the selected sauce.
 *  Finding the selected sauce in the database by the URL parameter.
 *  Delete the image from the directory and then delete the sauce from the database. */
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

/** This function handles the Like & Dislike of the selected sauce.
 *  First check if the user has liked or disliked the sauce (this sent by the frontend).
 *  Add like/dislike and userId to their appropriate counters on the sauce object.
 *  If user already voted remove the vote and the userId from their appropriate groups,
 *  then update the database. */
exports.likeDislikeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const likeFound = sauce.usersLiked.find((element) => element === req.body.userId);
    const dislikeFound = sauce.usersDisliked.find((element) => element === req.body.userId);

    if (req.body.like === 1) {
      sauce.usersLiked.push(req.body.userId);
      sauce.likes += 1;
      saveToDatabase(sauce, res, "Like added!");
    }

    if (req.body.like === -1) {
      sauce.usersDisliked.push(req.body.userId);
      sauce.dislikes += 1;
      saveToDatabase(sauce, res, "Dislike added!");
    }

    if (req.body.like === 0) {
      function removeVote(usersVoted, votes) {
        const index = usersVoted.indexOf(req.body.userId);
        if (index > -1) {
          usersVoted.splice(index, 1);
          votes -= 1;
          return votes;
        }
      }

      if (likeFound) {
        const votesReturned = removeVote(sauce.usersLiked, sauce.likes);
        sauce.likes = votesReturned;
        saveToDatabase(sauce, res, "Like removed!");
      }
      if (dislikeFound) {
        const votesReturned = removeVote(sauce.usersDisliked, sauce.dislikes);
        sauce.dislikes = votesReturned;
        saveToDatabase(sauce, res, "Dislike removed!");
      }
    }
  });
};
