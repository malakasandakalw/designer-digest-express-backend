const designerService = require("../services/designer-service");
const userService = require("../services/user-service")

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

exports.getDataByDesigner  = async (req, res) => {
    try {
        const designer_id = req.query.designer_id

        const userId = req.query.user_id ? req.query.user_id : null;

        const result = await designerService.getDataByDesigner(designer_id, userId)
        if(result) return res.status(200).json({ message: 'Designer fetched successfully', body: {result}, status: 'success' });

        return  res.status(200).json({ message: 'Designer fetched failed', body: {}, status: 'error' });

    } catch (e) {
        console.error('error in get posts function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}

exports.getDesignerDataByUserId = async (req, res) => {
    try {
        const userId = req.query.userId;

        const result = await designerService.getDesignerDataByUserId(userId)
        if(result) return res.status(200).json({ message: 'Designer fetched successfully', body: {result}, status: 'success' });

        return  res.status(200).json({ message: 'Designer fetched failed', body: {}, status: 'error' });

    } catch (e) {
        console.error('error in get posts function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}

exports.getDashboardDate = async (req, res) => {
    try {

        const start_date = req.query.start_date
        const end_date = req.query.end_date
        const user_id = req.user.id

        const followings = await designerService.getDashboardFollowingCount(user_id, start_date, end_date)
        const votes = await designerService.getDashboardVotesCount(user_id, start_date, end_date)        
        const posts = await designerService.getDashboardPostsCount(user_id, start_date, end_date)

        const data = {
            followings,
            votes,
            posts
        }
        return res.status(200).json({ message: 'Dashboard successfully', body: {data}, status: 'success' });

    } catch (e) {
        console.error('error in get posts function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}

exports.getFilteredDesigners = async (req, res) => {
    try {
        const followed_only = req.query.followed_only
        const categories = req.query.categories
        const orderBy = req.query.order_by
        const locations = req.query.locations
        const search = req.query.search
        const pageIndex = req.query.page_index
        const pageSize = req.query.page_size
        const userId = req.query.userId

        if(userId) {
            const result = await designerService.getFilteredDesigners(userId, followed_only, categories, orderBy, locations, search, pageIndex, pageSize)
            return res.status(200).json({ message: 'Designers fetched successfully', body: {result}, status: 'success' });
        } else {
            const result = await designerService.getPublicFilteredDesigners(categories, orderBy, locations, search, pageIndex, pageSize)
            return res.status(200).json({ message: 'Designers fetched successfully', body: {result}, status: 'success' });
        }

    } catch (e) {
        console.error('error in get posts function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}

exports.follow = async (req, res) => {
    try {
        const userId = req.user.id;
        if(!userId) return res.status(200).json({ message: 'User not found', body: {}, status: 'error' });

        const {designer_id} = req.body
        if(!designer_id) return res.status(200).json({ message: 'Post not found', body: {}, status: 'error' });

        const followed = await designerService.follow(designer_id, userId)

        if(!followed) return res.status(200).json({ message: 'There is error when following', body: {}, status: 'error' });

        return res.status(200).json({ message: 'Now you are following', body: {followed}, status: 'success' });

    } catch (e) {
        console.error('error in upvote function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });        
    }
}

exports.updateDesigner = async (req, res) => {
    try {

        const {user_id, designer_id, first_name, last_name, categories, location, profile_picture, phone } = req.body;

        const userUpdated = await designerService.updateUserData(user_id, first_name, last_name, location, profile_picture, phone)
        if(!userUpdated) return res.status(200).json({ message: 'User update failed. Try again later!', body: {}, status: 'error' })

        const categoriesDeleted = await designerService.deleteDesignerCategories(designer_id)
        if(!categoriesDeleted) return res.status(200).json({ message: 'Designer categories delete failed. Try again later!', body: {}, status: 'error' })

        const designerCategoryUpdated = await designerService.createDesignerCategories(designer_id, categories)
        if(!designerCategoryUpdated) return res.status(200).json({ message: 'Designer update failed. Try again later!', body: {}, status: 'error' })

        const userData = await userService.getUserbyId(user_id)
        if(userData) return res.status(200).json({ message: 'Profile updated succesfully.', body: { user: userData }, status: 'success' });
        return res.status(200).json({ message: 'Update failed. Try again later!', body: { user: userData}, status: 'error' });

    } catch (e) {
        console.error('error in update Designer function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}