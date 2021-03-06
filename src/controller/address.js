const UserAddress = require("../models/address");

exports.addAddress = (req, res) => {
  //return res.status(200).json({body: req.body})
  const { payload } = req.body; // {payload: {address: {}}}
  if (payload.address) {
    if (payload.address._id) { // update address {user: {}, address: {}}
      UserAddress.findOneAndUpdate(
        { user: req.user._id, "address._id": payload.address._id }, // check two conditions
        {
          $set: {
            "address.$": payload.address, // '.$' refers to '._id'
          },
        }
      ).exec((error, address) => {
        if (error) return res.status(400).json({ error });
        if (address) {
          res.status(201).json({ address });
        }
      });
    } else {
      UserAddress.findOneAndUpdate(
        { user: req.user._id },
        {
          $push: {
            address: payload.address,
          },
        },
        { new: true, upsert: true }
      ).exec((error, address) => {
        if (error) return res.status(400).json({ error });
        if (address) {
          res.status(201).json({ address });
        }
      });
    }
  } else {
    res.status(400).json({ error: "Params address required" });
  }
};

exports.getAddress = (req, res) => {
  UserAddress.findOne({ user: req.user._id }).exec((error, userAddress) => {
    if (error) return res.status(400).json({ error });
    if (userAddress) {
      console.log({userAddress})
      res.status(200).json({ userAddress });
    }
  });
};