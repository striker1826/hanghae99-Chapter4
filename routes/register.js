const express = require('express');
const router = express.Router();
const { Users } = require("../models")
const { Op } = require('sequelize');
const crypto = require('crypto')
const key = '신기하다.'

function pbkdf2(password, salt, iterations, len, hashType) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, len, hashType, (err, key) => {
            err ? reject(err) : resolve(key.toString('base64'));
        });
    });
}

router.post("/", async (req, res) => {
    if (req.headers.authorization) {
        res.status(400).send({ errorMessage: "로그인이 이미 되어있습니다." })
        return;
    }
    const { nickname, password, confirm } = req.body;
    const nicknameReg = /^[a-zA-Z0-9]{3,20}$/;
    const passwordReg = /^[a-zA-Z0-9]{4,20}$/;
    if (!nicknameReg.test(nickname) && !passwordReg.test(password)) {
        res.status(400).send({ errorMessage: '아이디나 비밀번호가 조건에 맞는지 확인해주세요.' })
        return;
    }
    if (nickname === password) {
        res.send({ errorMessage: '아이디와 비밀번호가 다른지 확인해주세요.' })
        return;
    }
    if (password !== confirm) {
        res.status(400).send({
            errorMessage: '패스워드가 일치하지 않습니다.'
        });
        return;
    }
    const existsUsers = await Users.findAll({where: {nickname}});
    if (existsUsers.length) {
        res.status(400).send({
            errorMessage: "닉네임이 이미 사용중입니다."
        })
        return;
    }

    const hashPassword = await pbkdf2(password, key, 195411, 141, 'sha512')
    await Users.create({ nickname: nickname, password: hashPassword })
    res.status(201).send({})
});

module.exports = router;
