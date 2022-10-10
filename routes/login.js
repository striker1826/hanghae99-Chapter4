const express = require("express");
const router = express.Router();
const crypto = require('crypto')
const { Users } = require('../models');
const { Op } = require('sequelize');
const key = '신기하다.'

const jwt = require('jsonwebtoken');

function pbkdf2(password, salt, iterations, len, hashType) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, len, hashType, (err, key) => {
            err ? reject(err) : resolve(key.toString('base64'));
        });
    });
}

// 로그인
router.post('/', async (req, res) => {
    const { nickname, password } = req.body;
    const hashPassword = await pbkdf2(password, key, 195411, 141, 'sha512')
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
        res.send({ token })
    }
    catch (e) {
        return res.status(400).json({ success: false, errorMessage: "닉네임 또는 패스워드를 확인해주세요." })
    }
})

module.exports = router;
