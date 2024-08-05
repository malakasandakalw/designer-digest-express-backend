
const bodyParser = require("body-parser");

module.exports = (req, res, next) => {
    bodyParser.json({ limit: '50mb' })(req, res, (err) => {
        if (err) return next(err);
        bodyParser.urlencoded({ limit: '50mb', extended: true })(req, res, next);
    });
};