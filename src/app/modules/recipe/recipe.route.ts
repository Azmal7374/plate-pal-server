import express from 'express';
import { RecipeControllers } from './recipe.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/create-recipe', auth('user'), RecipeControllers.createRecipe);

router.post(
  '/upvote-recipe/:recipeId',
  auth('user'),
  RecipeControllers.upvoteRecipe,
);

router.post(
  '/downvote-recipe/:recipeId',
  auth('user'),
  RecipeControllers.downvoteRecipe,
);

router.post(
  '/rate-recipe/:recipeId',
  auth('user'),
  RecipeControllers.rateRecipe,
);

router.post(
  '/comment-recipe/:recipeId',
  auth('user'),
  RecipeControllers.commentRecipe,
);

router.post(
  '/update-comment-recipe/:recipeId/:commentId',
  auth('user'),
  RecipeControllers.updateCommentRecipe,
);

router.delete(
  '/delete-recipe/:recipeId',
  auth('user', 'admin'),
  RecipeControllers.deleteRecipe,
);

router.get(
  '/get-all-recipe',
  auth('user', 'admin'),
  RecipeControllers.getAllRecipe,
);

router.get(
  '/get-single-recipe/:recipeId',
  auth('user', 'admin'),
  RecipeControllers.getSingleRecipe,
);

router.get(
  '/get-all-recipies-for-admin',
  auth('admin'),
  RecipeControllers.getAllRecipiesForAdmin,
);

router.post(
  '/unpublish-recipe/:id',
  auth('admin'),
  RecipeControllers.unpublishRecipe,
);

router.post(
  '/publish-recipe/:id',
  auth('admin'),
  RecipeControllers.publishRecipe,
);

export const RecipeRoutes = router;
