const postsService = require("../services/posts-service")

exports.createPost = async (req, res) => {
    try {
        
        const userId = req.user.id;
        if(!userId) return res.status(200).json({ message: 'Posts getting failed. Try again later!', body: {}, status: 'error' });

        const {title, description, categories, files, thumbnail } = req.body;

        const postId = await postsService.createPost(title, description, userId)
        if(!postId) return res.status(200).json({ message: 'Post Creation failed. Try again later!', body: {}, status: 'error' })

        const postCategoryUpdated = await postsService.createPostCategories(postId, categories)
        if(!postCategoryUpdated) return res.status(200).json({ message: 'Post Creation failed. Try again later!', body: {}, status: 'error' })
        
        const postFilesUpdated = await postsService.createPostFiles(postId, files, thumbnail)
        if(!postFilesUpdated) return res.status(200).json({ message: 'Post Creation failed. Try again later!', body: {}, status: 'error' })

        return res.status(200).json({ message: 'Post created successfully', body: {}, status: 'success' });

    } catch (e) {
        console.error('error in create user function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }

}

exports.getByDesigner = async (req, res) => {
    try {
        const userId = req.user.id;
        if(!userId) return res.status(200).json({ message: 'Posts getting failed. Try again later!', body: {}, status: 'error' });

        const result = await postsService.getByDesigner(userId)

        return res.status(200).json({ message: 'Post fetched successfully', body: {result}, status: 'success' });

    } catch (e) {
        console.error('error in create user function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }

}