const express = require("express");
const router = express.Router();
const { Post } = require('../models')
const { Op, and, INTEGER } = require('sequelize');
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

    const is_liked = await likes.findOne({
        where: {
            postId,
            user:userId
        }
    })
    if (is_liked) {
        result = {data: false}
        await likes.destroy({where: {
            postId:postId,
            user:userId
    }})
    }
    else {
        result = {data: true}
        await likes.create({ 
            postId,  user:userId })
        
       
    }
    res.json(result)
})

// 좋아요 게시글 조회
router.get('/like', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const postsNum = await likes.findAll({where: {user:userId}})
    
    let data = []
    for (let i=0; i<postsNum.length; i++) {
        data.push(postsNum[i].postId)
    }

    let postsData = []
    for (let i=0; i<data.length; i++) {
        let like = await likes.count({
            where: {
                postId: data[i]  
            }
        })

        await Post.update({ likes: like}, {
            where: {
                Id:data[i]
            }
        })

        const posts = await Post.findAll({
            where: {
                id:data[i]
            }

        })

        postsData.push(posts)
    }

    res.send(postsData)
}) 

// 게시글 상세 조회
router.get('/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const { nickname } = res.locals.user
        const post = await Post.findOne({ where: { 
            id: postId,
            nickname: nickname
        } });

        res.send(post)
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
            where: {
                id: postId
            }
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
            where: {
                id: postId,
                nickname: nickname
            }
        })

        res.send({ message: "게시글을 삭제하였습니다." })
    }

    catch (e) {
        res.status(400).send({ errorMessage: "게시글 삭제에 실패했습니다." })
    }
})



module.exports = router;