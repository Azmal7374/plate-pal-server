import { RequestHandler } from 'express';
import sendResponse from '../../utils/sendResponse/sendResponse';
import { RecipeServices } from './recipe.service';

const createRecipe: RequestHandler = async (req, res, next) => {
  try {
    const result = await RecipeServices.createRecipe(req.body, req.user);

    sendResponse(res, result, 'Recipe has been created succesfully');
  } catch (error) {
    next(error);
  }
};

const upvoteRecipe: RequestHandler = async (req, res, next) => {
  try {
    const result = await RecipeServices.upvoteRecipe(
      req.params.recipeId,
      req.user,
    );

    sendResponse(res, result, 'Recipe has been upvotted');
  } catch (error) {
    next(error);
  }
};

const downvoteRecipe: RequestHandler = async (req, res, next) => {
  try {
    const result = await RecipeServices.downvoteRecipe(
      req.params.recipeId,
      req.user,
    );

    sendResponse(res, result, 'Recipe has been downvotted');
  } catch (error) {
    next(error);
  }
};

const rateRecipe: RequestHandler = async (req, res, next) => {
  try {
    const result = await RecipeServices.rateRecipe(
      req.params.recipeId,
      req.user,
      req.body.rating,
    );

    sendResponse(res, result, 'Recipe has been rated');
  } catch (error) {
    next(error);
  }
};

const commentRecipe: RequestHandler = async (req, res, next) => {
  try {
    const result = await RecipeServices.commentRecipe(
      req.params.recipeId,
      req.user,
      req.body.comment,
    );

    sendResponse(res, result, 'Comment has been added');
  } catch (error) {
    next(error);
  }
};

const deleteRecipe: RequestHandler = async (req, res, next) => {
  try {
    const result = await RecipeServices.deleteRecipe(req.params.recipeId);

    sendResponse(res, result, 'Deleted Successfully');
  } catch (error) {
    next(error);
  }
};

const getAllRecipe: RequestHandler = async (req, res, next) => {
  try {
    const result = await RecipeServices.getAllRecipies();

    sendResponse(res, result, 'Fetched Successfully');
  } catch (error) {
    next(error);
  }
};

const getSingleRecipe: RequestHandler = async (req, res, next) => {
  try {
    const result = await RecipeServices.getSingleRecipe(req.params.recipeId);

    sendResponse(res, result, 'Fetched Successfully');
  } catch (error) {
    next(error);
  }
};

const updateCommentRecipe: RequestHandler = async (req, res, next) => {
  try {
    const result = await RecipeServices.editRecipeComment(
      req.params.recipeId,
      req.params.commentId,
      req.body.comment,
    );

    sendResponse(res, result, 'Fetched Successfully');
  } catch (error) {
    next(error);
  }
};

const getAllRecipiesForAdmin: RequestHandler = async (req, res, next) => {
  try {
    const result = await RecipeServices.getAllRecipiesForAdmin();

    sendResponse(res, result, 'Fetched Successfully');
  } catch (error) {
    next(error);
  }
};

const unpublishRecipe: RequestHandler = async (req, res, next) => {
  try {
    const result = await RecipeServices.unpublishRecipe(req.params.id);

    sendResponse(res, result, 'Unpublished Successfully');
  } catch (error) {
    next(error);
  }
};

const publishRecipe: RequestHandler = async (req, res, next) => {
  try {
    const result = await RecipeServices.publishRecipe(req.params.id);

    sendResponse(res, result, 'Published Successfully');
  } catch (error) {
    next(error);
  }
};

export const RecipeControllers = {
  createRecipe,
  upvoteRecipe,
  downvoteRecipe,
  rateRecipe,
  commentRecipe,
  deleteRecipe,
  getAllRecipe,
  getSingleRecipe,
  updateCommentRecipe,
  getAllRecipiesForAdmin,
  unpublishRecipe,
  publishRecipe,
};