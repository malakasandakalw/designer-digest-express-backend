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
        console.error('error in create vacancy function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }

}

exports.updateVacancy = async (req, res) => {
    try {

        const {id, title, description, categories, locations, files, is_active } = req.body;

        const vacancyUpdated = await vacancyService.updateVacancy(id, title, description, files.url, is_active)
        if(!vacancyUpdated) return res.status(200).json({ message: 'Vacancy update failed. Try again later!', body: {}, status: 'error' })

        const categoriesDeleted = await vacancyService.deleteVacancyCategories(id)
        if(!categoriesDeleted) return res.status(200).json({ message: 'Vacancy categories delete failed. Try again later!', body: {}, status: 'error' })

        const locationsDeleted = await vacancyService.deleteVacancyLocations(id)
        if(!locationsDeleted) return res.status(200).json({ message: 'Vacancy Location delete failed failed. Try again later!', body: {}, status: 'error' })

        const vacancyCategoryUpdated = await vacancyService.createvacancyCategories(id, categories)
        if(!vacancyCategoryUpdated) return res.status(200).json({ message: 'vacancy update failed. Try again later!', body: {}, status: 'error' })

        const vacancyLocationUpdated = await vacancyService.createvacancyLocations(id, locations)
        if(!vacancyLocationUpdated) return res.status(200).json({ message: 'vacancy Creation failed. Try again later!', body: {}, status: 'error' })

        return res.status(200).json({ message: 'Vacancy updated successfully', body: {}, status: 'success' });

    } catch (e) {
        console.error('error in update vacancy function', e);
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

        const userId = req.query.userId ? req.query.userId : null

        if(userId) {
            const result = await vacancyService.getByIdWithUser(vacancyId,userId)
            return res.status(200).json({ message: 'Vacancy fetched successfully', body: {result}, status: 'success' });
        } else {
            const result = await vacancyService.getById(vacancyId)
            return res.status(200).json({ message: 'Vacancy fetched successfully', body: {result}, status: 'success' });
        }

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





exports.getFilteredVacancies = async (req, res) => {
    try {
        const applied_only = req.query.applied_only
        const categories = req.query.categories
        const locations = req.query.locations
        const pageIndex = req.query.page_index
        const pageSize = req.query.page_size
        const user_id = req.query.user_id

        if(user_id) {
            const result = await vacancyService.getFilteredVacancies(user_id, applied_only, categories, locations, pageIndex, pageSize)
            return res.status(200).json({ message: 'Vacancies fetched successfully', body: {result}, status: 'success' });
        } else {
            const result = await vacancyService.getPublicFilteredVacancies(categories, locations, pageIndex, pageSize)
            return res.status(200).json({ message: 'Vacancies fetched successfully', body: {result}, status: 'success' });
        }

    } catch (e) {
        console.error('error in get posts function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}
