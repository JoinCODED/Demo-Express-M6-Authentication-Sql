const StudentModel = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Name already exists',
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Student;
};

module.exports = StudentModel;
