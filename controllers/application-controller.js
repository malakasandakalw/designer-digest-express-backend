const applicationService = require("../services/application-service")

exports.createApplication = async (req, res) => {
    try {
        
        const userId = req.user.id;
        if(!userId) return res.status(200).json({ message: 'Application creating failed. Try again later!', body: {}, status: 'error' });

        const {files, vacancyId } = req.body;

        const applicationId = await applicationService.createApplication(userId, files.url, vacancyId)
        if(!applicationId) return res.status(200).json({ message: 'Application Creation failed. Try again later!', body: {}, status: 'error' })

        return res.status(200).json({ message: 'Application created successfully', body: {}, status: 'success' });

    } catch (e) {
        console.error('error in create application function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }

}

exports.updateApplication = async (req, res) => {
    try {

        const {files, applicationId } = req.body;

        const updated = await applicationService.updateApplication(files.url, applicationId)
        if(!updated) return res.status(200).json({ message: 'Application Update failed. Try again later!', body: {}, status: 'error' })

        return res.status(200).json({ message: 'Application updated successfully', body: {}, status: 'success' });

    } catch (e) {
        console.error('error in update application function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }

}