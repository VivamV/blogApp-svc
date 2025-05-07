import { userModel, postsModel } from "../models/userSchema.js";

export const createBlogs = async (req, res) => {
  try {

    const { id } = req.user;
    // console.log("body of create",req.body)
    const  imageURL = req.body.imagePath;
    const  description = req.body.description;
    // console.log(imageURL);
    // console.log(description);
    const newPost = new postsModel({ user: id, caption:description, imageURL:imageURL });
    await newPost.save();
    // console.log("ho gays save")
    res.send("blogs ban gaye");
  } 
  catch (err) {
    // console.log("ghus gya catch mei");
    return res.status(500).json({ message: "error", err });
  }
};

export const allBlogs = async (req, res) => {
  try {
    const postCount = req.query.postCount || 1;
    const totalCount = await postsModel.countDocuments();
    const totalPost = 3;
    const posts = await postsModel.find({}).populate("user", "fullname profileimageURL")
      .sort({createdAt:-1})
      .skip((postCount - 1) * totalPost)
      .limit(totalPost);
    res.json({ data:posts, totalCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const myBlogs = async (req, res) => {
  const { id } = req.user;
  try {
    const myPosts = await postsModel.find({user: id }).populate("user", "fullname profileimageURL").sort({createdAt:-1});
    // console.log(myPosts);
    return res.status(200).json({ data: myPosts });
  } catch (err) {
    return res.status(500).json({ message: "error", err });
  }
};

export const deletecontroller=async (req, res) => {
  try {
    // console.log("delete ke trymein");

    const postId = req.params.postId;
    // console.log(postId);
    await postsModel.findByIdAndDelete(postId);
    // console.log("ho gaya delete");

    res.status(204).send(); 
  } catch (error) {
    // console.log("delete ke catch mein");
    // console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
export const likecontroller=async (req, res) => {
  const { postId, userId } = req.body;
// console.log("liek route userid",userId);
// console.log("liek route posid",postId);
  try {
    // console.log("try like");
    const post = await postsModel.findById(postId);
    // console.log("post aa gyi",post);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    // console.log("finalpost",post);
    res.status(200).json({ likes: post.likes, isLiked: !isLiked });
  } catch (error) {
    // console.log("ghus gya like ke catch mei");
    res.status(500).json({ message: 'Error updating likes', error });
  }
}

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("edit body",req.body);
    const  imageURL = req.body.imagePath;
    const  description = req.body.description;
    // console.log("inside update ka description",description)
   if(description.length===0)
   { res.status(500).json({ message: 'Error updating blog post', error });}
    const updatedBlog = await  postsModel.findByIdAndUpdate(id, {caption:description, imageURL:imageURL},{ new: true });

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(updatedBlog);
  } catch (error) {
    // console.log("update ke catch mei ")
    res.status(500).json({ message: 'Error updating blog post', error });
  }
};
