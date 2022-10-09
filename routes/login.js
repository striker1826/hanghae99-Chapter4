const express = require("express");
const router = express.Router();
const crypto = require('crypto')
const { Users } = require('../models');
const { Op } = require('sequelize');
const key = '신기하다.' 

const jwt = require('jsonwebtoken');
const authorization = require("../middlewares/auth-middleware");
const authMiddleware = require("../middlewares/auth-middleware");

router.post('/', async (req, res) => {
    const { nickname, password } = req.body;

    const cipher = (password, key) => {
        const encrypt = crypto.createCipher('des', key) // des알고리즘과 키를 설정
        const encryptResult = encrypt.update(password, 'utf8', 'base64') // 암호화
            + encrypt.final('base64') // 인코딩
            
        return encryptResult
    }
    const hashPassword = cipher(password, key)

    if (req.headers.authorization) {
        res.status(400).send({ errorMessage: "로그인이 이미 되어있습니다." })
        return
    }
    try {
        const user = await Users.findAll({
            where: {
                nickname: nickname,
                password: hashPassword
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