import { JwtPayload } from 'jsonwebtoken';
import { TRecipe } from './recipe.interface';
import RecipeModel from './recipe.model';
import UserModel from '../user/user.model';

const createRecipe = async (payload: TRecipe, user: JwtPayload) => {
  const userRecord = await UserModel.findById(user.userId);

  if (!userRecord) {
    throw new Error('User not found');
  }

  if (userRecord.isBlocked) {
    throw new Error('Your account has been blocked!');
  }

  payload.user = user.userId;

  if (payload.isPremium) {
    payload.isPremium = true;
  }

  const result = await RecipeModel.create(payload);
  return result;
};

const upvoteRecipe = async (recipeId: string, user: JwtPayload) => {
  const recipe = await RecipeModel.findById(recipeId);

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  if (recipe.upvote.includes(user.userId)) {
    throw new Error('You have already upvoted this recipe');
  }

  if (recipe.downvote.includes(user.userId)) {
    await RecipeModel.findByIdAndUpdate(
      recipeId,
      {
        $pull: { downvote: user.userId },
      },
      { new: true },
    );
  }

  const updatedRecipe = await RecipeModel.findByIdAndUpdate(
    recipeId,
    {
      $addToSet: { upvote: user.userId }, 
    },
    { new: true },
  );

  return updatedRecipe;
};

const downvoteRecipe = async (recipeId: string, user: JwtPayload) => {
  const recipe = await RecipeModel.findById(recipeId);

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  if (recipe.upvote.includes(user.userId)) {
    await RecipeModel.findByIdAndUpdate(
      recipeId,
      {
        $pull: { upvote: user.userId },
      },
      { new: true },
    );
  }

  if (recipe.downvote.includes(user.userId)) {
    throw new Error('You have already downvoted this recipe');
  }

  const updatedRecipe = await RecipeModel.findByIdAndUpdate(
    recipeId,
    {
      $addToSet: { downvote: user.userId }, // $addToSet prevents duplicates
    },
    { new: true },
  );

  return updatedRecipe;
};

const rateRecipe = async (
  recipeId: string,
  user: JwtPayload,
  newRating: number,
) => {
  const recipe = await RecipeModel.findById(recipeId);

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  const existingRatingIndex = recipe.rating.findIndex(
    (r) => r.id === user.userId,
  );

  if (existingRatingIndex !== -1) {
    recipe.rating[existingRatingIndex].rating = newRating;
  } else {
    recipe.rating.push({ id: user.userId, rating: newRating });
  }

  const updatedRecipe = await recipe.save();

  return updatedRecipe;
};

const commentRecipe = async (
  recipeId: string,
  user: JwtPayload,
  comment: string,
) => {
  const recipe = await RecipeModel.findById(recipeId);

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  recipe.comments.push({
    id: user.userId,
    name: user.name,
    profilePicture: user.profilePicture,
    comment: comment,
  });

  const updatedRecipe = await recipe.save();

  return updatedRecipe;
};

const getAllRecipies = async () => {
  const result = await RecipeModel.find({ isPublished: true });

  return result;
};

const getSingleRecipe = async (id: string) => {
  const result = await RecipeModel.findById(id);

  const postOwner = await UserModel.findById(result?.user);

  return { result, postOwner };
};

const deleteRecipe = async (recipeId: string) => {
  const result = await RecipeModel.findByIdAndDelete(recipeId);

  return result;
};

const editRecipeComment = async (
  recipeId: string,
  commentId: string,
  newCommentText: string,
) => {
  const updatedRecipe = await RecipeModel.findOneAndUpdate(
    {
      _id: recipeId,
      'comments._id': commentId,
    },
    {
      $set: { 'comments.$.comment': newCommentText },
    },
    { new: true },
  );

  if (!updatedRecipe) {
    throw new Error('Recipe or comment not found');
  }

  return updatedRecipe;
};

const getAllRecipiesForAdmin = async () => {
  const result = await RecipeModel.find();

  return result;
};

const unpublishRecipe = async (id: string) => {
  const recipe = await RecipeModel.findOneAndUpdate(
    { _id: id },
    { isPublished: false },
    { new: true },
  );

  return recipe;
};

const publishRecipe = async (id: string) => {
  const recipe = await RecipeModel.findOneAndUpdate(
    { _id: id },
    { isPublished: true },
    { new: true },
  );

  return recipe;
};

export const RecipeServices = {
  createRecipe,
  upvoteRecipe,
  downvoteRecipe,
  rateRecipe,
  commentRecipe,
  deleteRecipe,
  getAllRecipies,
  getSingleRecipe,
  editRecipeComment,
  getAllRecipiesForAdmin,
  unpublishRecipe,
  publishRecipe,
};