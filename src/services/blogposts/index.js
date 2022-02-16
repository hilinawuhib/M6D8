import express from "express";
import createHttpError from "http-errors";
import BlogsModel from "./schema.js";
import CommentModel from "../comments/schema.js";

const blogsRouter = express.Router();

blogsRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = new BlogsModel(req.body);
    const { _id } = await newBlog.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await BlogsModel.find();
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;

    const blog = await BlogsModel.findById(blogId);
    if (blog) {
      res.send(blog);
    } else {
      next(createHttpError(404, `blog with id ${blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const updatedBlog = await BlogsModel.findByIdAndUpdate(blogId, req.body, {
      new: true,
    });
    if (updatedBlog) {
      res.send(updatedBlog);
    } else {
      next(createHttpError(404, `blog with id ${blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const deletedBlog = await BlogsModel.findByIdAndDelete(blogId);
    if (deletedBlog) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `blog with id ${blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:blogId/comment", async (req, res, next) => {
  try {
    const blog = await BlogsModel.findById(req.params);
    if (blog) {
      res.send(user.comment);
    } else {
      next(error);
    }
  } catch (error) {
    next(error);
  }
});
blogsRouter.get("/:blogId/comment/:commentId", async (req, res, next) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    if (!blog) {
      res
        .status(404)
        .send({ message: `blog with ${req.params.id} is not found!` });
    } else {
      const commentIndex = blog.comments.findIndex(
        (comment) => comment._id.toString() === req.params.commentId
      );
      if (commentIndex === -1) {
        res.status(404).send({
          message: `comment with ${req.params.commentId} is not found!`,
        });
      } else {
        blog.comments[commentIndex] = {
          ...blog.comments[commentIndex]._doc,
          ...req.body,
        };
        await blog.save();
        res.status(204).send();
      }
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/:blogId/comment", async (req, res, next) => {
  try {
    const addedComment = await CommentModel.findById(req.body.commentId, {
      _id: 0,
    });
    if (addedComment) {
      const commentToInsert = {
        ...addedComment.toObject(),
        Date: new Date(),
      };
      console.log(commentToInsert);

      const modifiedBlog = await CommentModel.findByIdAndUpdate(
        req.params.commentId,
        { $push: { comment: addedComment } },
        { new: true }
      );
      if (modifiedBlog) {
        res.send(modifiedBlog);
      } else {
        next(
          createHttpError(404, `blog with Id ${req.params.blogId} not found!`)
        );
      }
    } 
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:blogid/comment/:commentId", async (req, res, next) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    if (!blog) {
      res
        .status(404)
        .send({ message: `blog with ${req.params.id} is not found!` });
    } else {
      const commentIndex = blog.comments.findIndex(
        (comment) => comment._id.toString() === req.params.commentId
      );
      if (commentIndex === -1) {
        res.status(404).send({
          message: `comment with ${req.params.commentId} is not found!`,
        });
      } else {
        blog.comments[commentIndex] = {
          ...blog.comments[commentIndex]._doc,
          ...req.body,
        };
        await blog.save();
        res.status(204).send();
      }
    }
  } catch (error) {
    console.log(error);
    res.send(500).send({ message: error.message });
  }
});
blogsRouter.delete("/:blogId/comment/:commentId", async (req, res, next) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    if (!blog) {
      res
        .status(404)
        .send({ message: `blog with ${req.params.id} is not found!` });
    } else {
      await Blogs.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            comments: { _id: req.params.commentId },
          },
        },
        { new: true }
      );
      res.status(204).send();
    }
  } catch (error) {
    console.log(error);
    res.send(500).send({ message: error.message });
  }
});

export default blogsRouter;
