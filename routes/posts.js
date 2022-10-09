const express = require("express");
const router = express.Router();
const { Post, sequelize } = require('../models')
const { likes } = require('../models')
const authMiddleware = require('../middlewares/auth-middleware');


// 게시글 작성
router.post('/', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    const { nickname } = res.locals.user
    try {
        await Post.create({ title,  nickname, content })
        res.send({ message: '게시글 작성에 성공하였습니다.' })
    }
    catch (e) {
        res.status(400).json({ errorMessage: "게시글 작성에서 에러가 발생했습니다." })
    }
})

// 게시글 전체 조회
router.get('/', async (req, res) => {
    try {
        const post = await Post.findAll()
        res.json({ post: post})
    }
    catch (e) {
        res.status(400).send({ errorMessage: "게시글 전체 조회에 실패했습니다." })
    }
})

// 좋아요
router.put('/:postId/like', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    let result = {};

    const is_liked = await likes.findOne({ where: { postId, user:userId } })

    if (is_liked) {
        result = {data: false}
        await likes.destroy({where: {postId:postId, user:userId}})
        await Post.decrement({likes : 1}, {where: {id:postId}})
    }
    else {
        result = {data: true}
        await likes.create({ postId,  user:userId })
        await Post.increment({likes : 1},{where: {id:postId}});
    }
    res.json(result)
})
  
// 좋아요 게시글 조회
router.get('/like', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;

    const [results, metadata] = await sequelize.query(
        "SELECT * FROM likes JOIN Posts ON likes.postId = Posts.id")
    const joinTable = results
    
    const myLikePost = []
    joinTable.map((x) => {x.user == userId ? myLikePost.push({
        postId: x.postId, userId: x.user,
        nickname: x.nickname, title: x.title,
        createdAt: x.createdAt, updatedAt: x.updatedAt,
        likes: x.likes
    }):
    false})
    let myLikeList = myLikePost.sort((a,b) => b.likes - a.likes)
    res.json({myLikePost})
}) 

// 게시글 상세 조회
router.get('/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    try {
        const { nickname } = res.locals.user
        console.log(postId)
        console.log(nickname)
        const post = await Post.findOne({ where: { id: postId } });
        res.json({post})
    }
    catch (e) {
        res.status(400).send({ errorMessage: "게시글 상세 조회에 실패했습니다." })
    }
})

// 게시글 수정
router.put('/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;
    try {
        await Post.update({ title: title, content: content }, {
            where: {id: postId}
        })
        res.send({ errorMessage: '게시글을 수정하였습니다.' })
    }
    catch (e) {
        res.status(400).send({ errorMessage: '게시글 수정에 실패했습니다.' })
    }
})

// 게시글 삭제
router.delete('/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { nickname } = res.locals.user;
    try {
        await Post.destroy({
            where: {id: postId, nickname: nickname}
        })
        res.send({ message: "게시글을 삭제하였습니다." })
    }
    catch (e) {
        res.status(400).send({ errorMessage: "게시글 삭제에 실패했습니다." })
    }
})

module.exports = router;