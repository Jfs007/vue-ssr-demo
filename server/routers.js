// 简单的路由
const express = require('express');
let router = express.Router();

router.get('/home', (req, res) => {
  res.json({
    title: '我是主页',
    content: ''
  });
})
router.get('/about', (req, res) => {
  res.json({
    title: '我是关于',
    content: ''
  });
})

module.exports = router;