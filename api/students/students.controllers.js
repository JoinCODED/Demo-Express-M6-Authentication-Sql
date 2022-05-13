const { Student } = require('../../db/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION_MS } = require('../../config/keys');

exports.fetchStudent = async (studentId, next) => {
  try {
    const student = await Student.findByPk(studentId);
    return student;
  } catch (error) {
    next(error);
  }
};

exports.signup = async (req, res) => {
  const { password } = req.body;
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.password = hashedPassword;
    const newStudent = await Student.create(req.body);
    const payload = {
      id: newStudent.id,
      name: newStudent.name,
      exp: Date.now() + JWT_EXPIRATION_MS,
    };
    const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  const { user } = req;
  const payload = {
    id: user.id,
    name: user.name,
    exp: JWT_EXPIRATION_MS, // the token will expire 15 minutes from when it's generated
  };
  const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
  res.json({ token });
};

exports.studentsDelete = async (req, res) => {
  try {
    await req.student.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.studentsUpdate = async (req, res) => {
  try {
    await req.student.update(req.body);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.studentsGet = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        {
          model: Course,
          as: 'courses',
          through: { attributes: [] },
        },
      ],
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
