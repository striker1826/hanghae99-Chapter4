const express = require("express");
const router = express.Router();
const { Comments } = require('../models')
const { Op } = require('sequelize')
const authMiddleware = require("../middlewares/auth-middleware");

// 댓글 생성
router.post('/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { comment } = req.body;
    const { nickname } = res.locals.user;
    console.log(Comments)

    console.log(postId)
    console.log(comment)

    await Comments.create({ userId: postId, nickname, comment: comment })
    res.send({ message: "댓글을 작성하였습니다." })
})

// 댓글 목록 조회
router.get('/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const comment = await Comments.findAll({
            where: {
                userId:postId
            }
        })

        let data = []
        for (let i=0; i<comment.length; i++) {
            data.push({
                commentId: comment[i].id,
                userId: comment[i].userId,
                nickname: comment[i].nickname,
                comment: comment[i].comment,
                createdAt: comment[i].createdAt,
                updatedAt: comment[i].updatedAt
            })
        }
        res.send(data)
    }
    catch (e) {
        res.status(400).send({ errorMessage: "댓글 목록 조회에 실패했습니다." })
    } 
})

// 댓글 수정
router.put('/:commentId', async(req, res) => {
    const { commentId } = req.params;
    const { comment  } = req.body; 
    try {
        Comments.update({ comment: comment }, {
            where: { id: commentId }
        })
        res.send({ message: '댓글을 수정하였습니다.'})
        console.log(Comments)
    }


    catch {
        res.status(400).send({errorMessage: '댓글 수정에 실패했습니다.'})
    }
})

// 댓글 삭제
router.delete('/:commentId', async(req, res) => {
    const { commentId } = req.params;

    try {
        await Comments.destroy({ where: {
            id: commentId
        } })
    
        res.send({ message: '댓글을 삭제하였습니다.'})
    }
    catch {
        res.status(400).send({ errorMessage: '댓글 삭제에 실패했습니다.' })
    }
})



module.exports = router