const vacancyService = require("../services/vacancy-service")

exports.createVacancy = async (req, res) => {
    try {
        
        const userId = req.user.id;
        if(!userId) return res.status(200).json({ message: 'Vacancy creating failed. Try again later!', body: {}, status: 'error' });

        const {title, description, categories, locations, files } = req.body;

        const vacancyId = await vacancyService.createVacancy(title, description, userId, files.url)
        if(!vacancyId) return res.status(200).json({ message: 'Vacancy Creation failed. Try again later!', body: {}, status: 'error' })

        const vacancyCategoryUpdated = await vacancyService.createvacancyCategories(vacancyId, categories)
        if(!vacancyCategoryUpdated) return res.status(200).json({ message: 'vacancy Creation failed. Try again later!', body: {}, status: 'error' })

        const vacancyLocationUpdated = await vacancyService.createvacancyLocations(vacancyId, locations)
        if(!vacancyLocationUpdated) return res.status(200).json({ message: 'vacancy Creation failed. Try again later!', body: {}, status: 'error' })

        return res.status(200).json({ message: 'Vacancy created successfully', body: {}, status: 'success' });

    } catch (e) {
        console.error('error in create user function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }

}

exports.getByEmployer = async (req, res) => {
    try {
        const userId = req.user.id;
        if(!userId) return res.status(200).json({ message: 'Vacancy getting failed. Try again later!', body: {}, status: 'error' });

        const categories = req.query.categories
        const active = req.query.active
        const locations = req.query.locations
        const search = req.query.search
        const pageIndex = req.query.page_index
        const pageSize = req.query.page_size

        const result = await vacancyService.getByEmployer(active, userId, categories, locations, search, pageIndex, pageSize)

        return res.status(200).json({ message: 'Vacancies fetched successfully', body: {result}, status: 'success' });

    } catch (e) {
        console.error('error in create user function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }

}

exports.getById = async (req, res) => {
    try {
        const vacancyId = req.query.id;
        if(!vacancyId) return res.status(200).json({ message: 'Vacancy getting failed. Try again later!', body: {}, status: 'error' });

        const result = await vacancyService.getById(vacancyId)

        return res.status(200).json({ message: 'Vacancy fetched successfully', body: {result}, status: 'success' });

    } catch (e) {
        console.error('error in create user function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}

exports.getFullById = async (req, res) => {
    try {
        const vacancyId = req.query.id;
        if(!vacancyId) return res.status(200).json({ message: 'Vacancy getting failed. Try again later!', body: {}, status: 'error' });

        const result = await vacancyService.getFullById(vacancyId)

        return res.status(200).json({ message: 'Vacancy fetched successfully', body: {result}, status: 'success' });

    } catch (e) {
        console.error('error in create user function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}


