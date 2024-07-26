import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to get articles',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to get articles',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
    )
      .populate('user')
      .populate('comments.author')
      .then((doc) => res.json(doc))
      .catch((err) => res.status(500).json({ message: 'Article not found' }));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to create article',
    });
  }
};

export const commentPost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const comment = {
      text: req.body.text,
      author: user._id,
    };

    post.comments.push(comment);
    await post.save();

    const populatedPost = await post.populate('comments.author');

    res.json(populatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to create comment',
    });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id).populate('comments.author');
    if (!post) {
      return res.status(404).send('Post not found');
    }

    res.json(post.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Failed to retrieve comments',
    });
  }
};

export const getLastComments = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).populate('comments.author').exec();

    const comments = posts
      .map((obj) => obj.comments)
      .flat()
      .slice(0, 5);

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to get comments',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete({
      _id: postId,
    })
      .then((doc) => res.json({ success: true }))
      .catch((err) => res.status(500).json({ message: 'Article not found' }));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to create article',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to create article',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to update article',
    });
  }
};
