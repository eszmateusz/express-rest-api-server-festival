const Seat = require('../models/seat.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Seat.find());
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Seat.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const sea = await Seat.findOne().skip(rand);

    if (!sea) {
      res.status(404).json({ message: 'Not found...' });
    } else {
      res.json(sea);
    }
  } catch (err) {
    res.json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const sea = await Seat.findById(req.params.id);

    if (!sea) {
      res.status(404).json({ message: 'Not found...' });
    } else {
      res.json(sea);
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.postNew = async (req, res) => {
  try {
    const { day, seat, client, email } = req.body;
    const newSeat = new Seat({ day: day, seat: seat, client: client, email: email });
    await Seat.exists({ day: day, seat: seat })? res.status(409).json({ message: "The slot is already taken"}) : await newSeat.save();
    res.json(newSeat);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.modifyById = async (req, res) => {
  const { day, seat, client, email } = req.body;

  try {
    await Seat.exists({ day: day, seat: seat })? 
    res.status(409).json({ message: "The slot is already taken"}) :
    Seat.findByIdAndUpdate(req.params.id, { $set: { day: day, seat: seat, client: client, email: email } }, { new: true }, (err, doc) => {
      err ? res.status(404).json({ message: 'Not found...' })
      : res.json(doc);
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteById = (req, res) => {
  try {
    Seat.findByIdAndDelete(req.params.id, { new: false }, (err, doc) => {
      err ? res.status(404).json({ message: 'Not found...' })
      : res.json(doc);
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};