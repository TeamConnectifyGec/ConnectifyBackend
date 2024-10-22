const Post = require('../../models/postModel');  // Assuming the Post model is in the models folder

exports.searchPosts = async (req, res) => {
  try {
    const { searchTerm } = req.body; // Get search term from query parameter

    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    // Perform a case-insensitive search on post title and check if searchTerm exists in post_hashes array
    const posts = await Post.find({
      $or: [
        { post_title: { $regex: searchTerm, $options: 'i' } },  // Case-insensitive search on post title
        { post_hashes: { $in: [searchTerm] } }  // Check if the search term exists in the post_hashes array
      ]
    }).populate('user_id', 'username name')  // Optionally populate the user who created the post
      .select('post_title post_content post_hashes post_image_link visibility post_points createdAt');  // Select the fields to return

    // If no posts are found, return a message
    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found' });
    }

    // Return the array of posts
    res.json(posts);

  } catch (error) {
    console.error(`Error during search: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

