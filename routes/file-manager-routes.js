const fs = require('fs');
const express = require('express');
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');
const router = express.Router();
const path = require('path');

router.post("/upload", (req, res) => {
    const files = req.body.files
    const fileNames = []

    files.forEach(file => {
        const base64Data = file.data.replace(/^data:.*;base64,/, '');
        const fileName = Date.now() + '-' + file.name;
        const filePath = path.join('uploads/', fileName);
        fs.writeFileSync(filePath, base64Data, 'base64');
        fileNames.push(fileName);
    });

    res.json({fileNames: fileNames})

})

module.exports = router;