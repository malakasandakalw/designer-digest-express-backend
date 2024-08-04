const categoryService = require("../services/category-service")

exports.getAll = async (req, res) => {
    try {
        const result = await categoryService.getAll();
        res.status(200).json({ message: 'Getting all categories success', body: result, done: true, status: 'success' });
    } catch (e) {
        console.error('error in gettin categories function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error' });
    }
}