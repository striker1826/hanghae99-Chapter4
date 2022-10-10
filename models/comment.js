// 정의 == 테이블에는 넣지않음

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Comments.init({ //객체를 만들어 줄거야
    id: { 
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    postId: DataTypes.STRING,
    nickname: DataTypes.STRING,
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};