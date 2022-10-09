const express = require('express');
const router = express.Router();
const { Users } = require("../models")
const { Op } = require('sequelize');
const crypto = require('crypto')
const key = '신기하다.' 


router.post("/", async (req, res) => {
    if (req.headers.authorization) {
        res.status(400).send({ errorMessage: "로그인이 이미 되어있습니다." })
        return;
    }
    const { nickname, password, confirm } = req.body;
    const nicknameReg = /^[a-zA-Z0-9]{3,20}$/;
    const passwordReg = /^[a-zA-Z0-9]{4,20}$/;
    if (!nicknameReg.test(nickname)) {
        res.status(400).send({ errorMessage: '아이디나 비밀번호가 조건에 맞는지 확인해주세요.' })
        return;
    }
    if (!passwordReg.test(password)) {
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
    const existsUsers = await Users.findAll({
        where: {
            [Op.or]: [{ nickname }],
        },
    });
    if (existsUsers.length) {
        res.status(400).send({
            errorMessage: "닉네임이 이미 사용중입니다."
        })
        return;
    }

    const cipher = (password, key) => {
        const encrypt = crypto.createCipher('des', key) // des알고리즘과 키를 설정
        const encryptResult = encrypt.update(password, 'utf8', 'base64') // 암호화
            + encrypt.final('base64') // 인코딩
            
        console.log(encryptResult)
        return encryptResult
    }
    const hashPassword = cipher(password, key)
    await Users.create({ nickname:nickname,  password: hashPassword})

    // crypto.randomBytes(64, async (err, buf) => {     //64바이트 길이의 salt 생성 => salt란? 
    //  crypto.pbkdf2(password, buf.toString('base64'), 100000, 64, 'sha512', async (err, key) => {
    //         const user = new Users({ nickname, password: key.toString('base64') });
    //         console.log('key: ', key.toString('base64'))
    //         await user.save();
    //     });
    // });

    // function randomkey(size) {
    //     return randomBytesAsync(size)
    // }

    // crypto.pbkdf2(password, (await randomkey(64)).toString('base64'), 100000, 64, 'sha512', (err, key) => {  //base64솔트/
    //     console.log("222:", key.toString('base64'))
    // })


    res.status(201).send({})
});

module.exports = router;
