const User = require('../models/User');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public (can restrict later)
const registerUser = async (req, res) => {
  const { s_no, army_no, rank, name, role, password } = req.body;

  try {
    const userExists = await User.findOne({ army_no });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      s_no,
      army_no,
      rank,
      name,
      role,
      password: hashedPassword
    });

    res.status(201).json({
      _id: user._id,
      s_no: user.s_no,
      army_no: user.army_no,
      rank: user.rank,
      name: user.name,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { army_no, password } = req.body;

  try {
    const user = await User.findOne({ army_no });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      _id: user._id,
      s_no: user.s_no,
      army_no: user.army_no,
      rank: user.rank,
      name: user.name,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};


const isValidObjectId = (id) => mongoose.isValidObjectId(id);

/**
 * POST /api/users/:userId/assign-course
 * Body: { courseId: string, overwrite?: boolean }
 * - overwrite: if false, will not replace an existing different course (defaults to true)
 */
async function assignCourseToUser (req, res){
  try {
    const { userId } = req.params;
    const { courseId, overwrite = true } = req.body;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }
    if (!isValidObjectId(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid courseId' });
    }

    const [user, course] = await Promise.all([
      User.findById(userId),
      Course.findById(courseId)
    ]);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const alreadyAssigned =
      user.course && user.course.toString() === courseId.toString();

    if (alreadyAssigned) {
      return res.json({
        success: true,
        message: 'User already assigned to this course',
        data: await user.populate('course', 'courseName durationWeeks')
      });
    }

    if (!overwrite && user.course && user.course.toString() !== courseId.toString()) {
      return res.status(409).json({
        success: false,
        message: 'User already has a different course. Set overwrite=true to replace.'
      });
    }

    user.course = courseId;
    await user.save();

    const populated = await user.populate('course', 'courseName durationWeeks');
    return res.status(200).json({ success: true, data: populated });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/users/assign-course
 * Body: {
 *   courseId: string,
 *   userIds?: string[],  // if omitted and all=true, assigns to all users
 *   all?: boolean,       // set true to target all users
 *   overwrite?: boolean  // defaults to false: only fill where course is empty
 * }
 */
async function bulkAssignCourse  (req, res){
  try {
    const { courseId, userIds, all = false, overwrite = false } = req.body;

    if (!isValidObjectId(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid courseId' });
    }
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (!all && (!Array.isArray(userIds) || userIds.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Provide userIds array or set all=true'
      });
    }

    const filter = all
      ? {}
      : { _id: { $in: userIds.filter(isValidObjectId) } };

    // If not overwriting, only target users without a course assigned
    if (!overwrite) {
      filter.$or = [{ course: null }, { course: { $exists: false } }];
    }

    const result = await User.updateMany(filter, { $set: { course: courseId } });

    return res.status(200).json({
      success: true,
      data: {
        matchedCount: result.matchedCount ?? result.n,     // mongoose v6/v5 compatibility
        modifiedCount: result.modifiedCount ?? result.nModified,
        overwrite
      }
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
module.exports = { registerUser, loginUser, getProfile, assignCourseToUser,
  bulkAssignCourse};
