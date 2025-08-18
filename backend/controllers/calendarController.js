const TrainingEvent = require('../models/TrainingEvent');

const getEvents = async (req, res) => {
  try {
    const events = await TrainingEvent.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createEvent = async (req, res) => {
  try {
    // Only CO / TrgOffr / TrgJCO can add
    if (!['CO', 'TrgOffr', 'TrgJCO'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to create events' });
    }
    const event = await TrainingEvent.create({
      ...req.body,
      s_no: req.user.s_no,
      army_no: req.user.army_no,
      rank: req.user.rank,
      name: req.user.name
    });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getEvents, createEvent };
