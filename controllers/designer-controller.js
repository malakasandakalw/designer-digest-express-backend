const designerService = require("../services/designer-service");

exports.getAllDesigners = async (req, res) => {
    try {
        const result = await designerService.getAllDesigners()
        if(result) return res.status(200).json({ message: 'Designers fetching success', body: result, status: 'success' });
        return res.status(200).json({ message: 'Designers fetching failed', body: [], status: 'error' });
    } catch (e) {
        console.error('error in get all Designers function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}