import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Нет удалось получить статьи",
    });
  }
};

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
    return res.status(500).json({
      message: "Нет удалось получить статьи",
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
        $inc: {
          viewsCount: 1,
        },
      },
      {
        returnDocument: "after",
      },
    )
      .then((doc) => {
        if (!doc) {
          return res.status("404").json({
            message: "Статья не найдена",
          });
        }

        return res.json(doc);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Нет удалось вернуть статью",
          });
        }
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Нет удалось получить статью",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete({
      _id: postId,
    })
      .then((doc) => {
        if (!doc) {
          return res.status(500).json({
            message: "Статья не найдена",
          });
        }

        res.json({
          success: true,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          message: "Нет удалось удалить статью",
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Нет удалось удалить статью",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(","),
      user: req.userId, // вернуться, откуда берется id в рек тут?
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Нет удалось создать статью",
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
        tags: req.body.tags,
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Нет удалось обновить статью",
    });
  }
};
