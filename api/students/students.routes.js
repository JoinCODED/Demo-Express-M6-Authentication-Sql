const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  studentsGet,
  studentsUpdate,
  studentsDelete,
  fetchStudent,
  signup,
  signin,
} = require('./students.controllers');

router.param('studentId', async (req, res, next, studentId) => {
  const student = await fetchStudent(+studentId, next);
  if (student) {
    req.student = student;
    next();
  } else {
    const err = new Error('StudentfetchStudent Not Found');
    err.status = 404;
    next(err);
  }
});

router.get('/', studentsGet);
router.post('/signup', signup);
router.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  signin
);

router.delete('/:studentId', studentsDelete);

router.put('/:studentId', studentsUpdate);

module.exports = router;
