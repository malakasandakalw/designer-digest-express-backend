const designerCategoryService = require("../services/designer-category-service")

exports.getAll = async (req, res) => {
    try {
        const result = await designerCategoryService.getAll();
        res.status(200).json({ message: 'Getting all designer categories success', body: result, done: true, status: 'success' });
    } catch (e) {
        console.error('error in gettin designer categories function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error' });
    }
}