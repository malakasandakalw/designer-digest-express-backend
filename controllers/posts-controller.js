const postsService = require("../services/posts-service")

exports.createPost = async (req, res) => {
    try {
        const userId = req.user.id;

        // const result = await postsService.createPost();
        // if(result) return res.status(200).json({ message: 'Converted succesfully', body: { converted: result}, status: 'success' });
        // return res.status(200).json({ message: 'Conversion failed. Try again later!', body: { converted: result}, status: 'error' });

    } catch (e) {
        console.error('error in create user function', e);
        res.status(200).json({ message: 'Internal server error', e, status: 'error'  });
    }
}