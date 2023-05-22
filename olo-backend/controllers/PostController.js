import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';

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
      message: 'Не удалось получить тэги',
    });
  }
};

export const getAll = async (req, res)    =>  {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        new: true,
      }
    ).populate('user');

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findByIdAndDelete({
      _id: postId,
    });

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json({
      success: true,
    });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const create = async (req, res)    =>  {
    try {
        const doc = new PostModel ({
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
            message: 'Не удалось создать статью',
        });
    }
}

export const update = async (req, res)  => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne({
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
        message: 'Не удалось обновить статью',
      });
  }
}

export const getComments = async (req, res) => {
  try {
      const postId = req.params.id;

      const post = await PostModel.findById(postId).populate('comments').exec();

      if (!post) {
          return res.status(404).json({
              message: 'Пост не найден',
          });
      }

      res.json(post.comments);
  } catch (err) {
      console.log(err);
      res.status(500).json({
          message: 'Не удалось получить комментарии',
      });
  }
};

export const createComment = async (req, res) => {
  try {
      const postId = req.params.id;

      const post = await PostModel.findById(postId);

      if (!post) {
          return res.status(404).json({
              message: 'Пост не найден',
          });
      }

      const comment = new CommentModel({
          text: req.body.text,
          author: req.body.author,
          post: postId,
      });

      const savedComment = await comment.save();

      post.comments.push(savedComment._id);
      await post.save();

      res.json(savedComment);
  } catch (err) {
      console.log(err);
      res.status(500).json({
          message: 'Не удалось создать комментарий',
      });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const comment = await CommentModel.findByIdAndDelete(commentId);

    if (!comment) {
      return res.status(404).json({
        message: 'Комментарий не найден',
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить комментарий',
    });
  }
};