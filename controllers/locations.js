const locationsService = require("../services/locations-service")

exports.getAll = async (req, res) => {
    try {
        const result = await locationsService.getAll();
        res.status(200).json({ message: 'Getting all locations success', body: result, done: true, status: 'success' });
    } catch (e) {
        console.error('error in gettin locations function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error' });
    }
}