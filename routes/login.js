const express = require("express");
const router = express.Router();

const { Users } = require('../models');
const { Op } = require('sequelize');

const jwt = require('jsonwebtoken');
const authorization = require("../middlewares/auth-middleware");
const authMiddleware = require("../middlewares/auth-middleware");

router.post('/', async (req, res) => {
    const { nickname, password } = req.body;

    if (req.headers.authorization) {
        res.status(400).send({ errorMessage: "로그인이 이미 되어있습니다." })
        return
    }
    try {
        const user = await Users.findAll({
            where: {
                nickname: nickname,
                password: password
            }
        })

        const token = jwt.sign({ userId: user[0].userId }, 'hihihi');
        res.send({
            token
        })
    }
    catch (e) {
        return res.status(400).json({ success: false, errorMessage: "닉네임 또는 패스워드를 확인해주세요." })
    }
})

module.exports = router;