// 정의 == 테이블에는 넣지않음

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Users.init({ //객체를 만들어 줄거야
    userId: { 
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    nickname: DataTypes.STRING, 
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};