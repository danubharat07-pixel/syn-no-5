const Performance = require('../models/Performance');

const getStats = async (req, res) => {
  try {
    const totalCourses = await Performance.countDocuments();
    const completedCourses = await Performance.countDocuments({ score: { $gte: 50 } });
    const pendingCourses = totalCourses - completedCourses;

    res.json([
      { title: 'Courses Completed', value: completedCourses, color: 'bg-green-600' },
      { title: 'Active Courses', value: totalCourses, color: 'bg-blue-600' },
      { title: 'Pending Tasks', value: pendingCourses, color: 'bg-yellow-600' }
    ]);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getStats };
