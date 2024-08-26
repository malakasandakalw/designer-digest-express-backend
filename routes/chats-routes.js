const express = require('express');
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');
const router = express.Router();
const chatsController = require("../controllers/chats-controller");

router.get("/get-all-by-designer", TokenAuthenticator, chatsController.getAllByDesigner);
router.get("/get-single-chat", TokenAuthenticator, chatsController.getSingleChat)
router.get("/get-unread-count", TokenAuthenticator, chatsController.getUnreadMessagesCount)
router.post("/read-all", TokenAuthenticator, chatsController.readAllByChat)

module.exports = router;