const express = require("express");
const router = express.Router();
const { Comments } = require('../models')
const authMiddleware = require("../middlewares/auth-middleware");

// 댓글 생성
router.post('/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { comment } = req.body;
    try {
        const { nickname } = res.locals.user;
        await Comments.create({ userId: postId, nickname, comment: comment })
        res.send({ message: "댓글을 작성하였습니다." })
    } catch (err) {
        res.status(400).send({ errorMessage:"댓글 생성에 실패했습니다" })
    }
})

// 댓글 목록 조회
router.get('/:postId', async (req, res) => {
    const { postId } = req.params;
    try {
        const comment = await Comments.findAll({ where: {userId:postId} }).sort((a,b) => b.updatedAt - a.updatedAt)
        res.send(comment)
    }
    catch (e) {
        res.status(400).send({ errorMessage: "댓글 목록 조회에 실패했습니다." })
    } 
})

// 댓글 수정
router.put('/:commentId', authMiddleware, async(req, res) => {
    const { commentId } = req.params;
    const { comment  } = req.body; 
   try {
        const { nickname } = res.locals.user
        Comments.update({ comment: comment }, { where: {id: commentId, nickname} })
        res.send({ message: '댓글을 수정하였습니다.'})
    }
    catch {
        res.status(400).send({errorMessage: '댓글 수정에 실패했습니다.'})
    }
})

// 댓글 삭제
router.delete('/:commentId', async(req, res) => {
    const { commentId } = req.params;
    try {
        const { nickname } = res.locals.user;
        await Comments.destroy({ where: {id: commentId, nickname} })
        res.send({ message: '댓글을 삭제하였습니다.'})
    }
    catch {
        res.status(400).send({ errorMessage: '댓글 삭제에 실패했습니다.' })
    }
})

module.exports = router