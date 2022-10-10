const jwt = require('jsonwebtoken');
const { Users } = require('../models');

module.exports = (req, res, next) => {
    try{
        const {authorization} = req.headers;
        const [tokenType, tokenValue] = authorization.split(' ')
    
        if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요'
        })
        return
        }
        const { userId } = jwt.verify(tokenValue, "hihihi");
        Users.findByPk(userId).then((user) => {
        res.locals.user = user
        console.log(res.locals.user)
        next();
        });
        next()
    }  
    catch (e) {
        res.status(401).send({
            errorMessage: '로그인 한 다음 사용하세요'
        })
        return;
    }
}