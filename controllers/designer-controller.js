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

        if(!followed) return res.status(200).json({ message: 'Follow error', body: {}, status: 'error' });

        return res.status(200).json({ message: 'Follow successfully', body: {followed}, status: 'success' });


    } catch (e) {
        console.error('error in upvote function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });        
    }
}