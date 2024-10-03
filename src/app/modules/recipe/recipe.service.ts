import { JwtPayload } from 'jsonwebtoken';
import { TRecipe } from './recipe.interface';
import RecipeModel from './recipe.model';
import UserModel from '../user/user.model';

const createRecipe = async (payload: TRecipe, user: JwtPayload) => {
  // Find the User:
  const userRecord = await UserModel.findById(user.userId);
if (!userRecord) {
  throw new Error('User not found');
}

// Check if User is Blocked:
if (userRecord.isBlocked) {
  throw new Error('Your account has been blocked!');
}

// Assign User ID to Recipe Payload:
payload.user = user.userId;

// Check for Premium Status:
if (payload.isPremium) {
  payload.isPremium = true;
}

// Create the Recipe:
const result = await RecipeModel.create(payload);
return result

};

const upvoteRecipe = async (recipeId: string, user: JwtPayload) => {
//  Find the Recipe:
const recipe = await RecipeModel.findById(recipeId);
if (!recipe) {
  throw new Error('Recipe not found');
}

// check for Existing Upvote:
if (recipe.upvote.includes(user.userId)) {
  throw new Error('You have already upvoted this recipe');
}
// Handle Downvote Cancellation:
if (recipe.downvote.includes(user.userId)) {
  await RecipeModel.findByIdAndUpdate(
    recipeId,
    {
      $pull: { downvote: user.userId },
    },
    { new: true },
  );
}

// Add Upvote:
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
  // Find the Recipe:
  const recipe = await RecipeModel.findById(recipeId);
if (!recipe) {
  throw new Error('Recipe not found');
}

// Handle Existing Upvote:
if (recipe.upvote.includes(user.userId)) {
  await RecipeModel.findByIdAndUpdate(
    recipeId,
    {
      $pull: { upvote: user.userId },
    },
    { new: true },
  );
}

// Check for Existing Downvote:
if (recipe.downvote.includes(user.userId)) {
  throw new Error('You have already downvoted this recipe');
}

// Add Downvote:
const updatedRecipe = await RecipeModel.findByIdAndUpdate(
  recipeId,
  {
    $addToSet: { downvote: user.userId },
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

  // Find the Recipe:
  const recipe = await RecipeModel.findById(recipeId);
if (!recipe) {
  throw new Error('Recipe not found');
}

// Check for Existing Rating:
const existingRatingIndex = recipe.rating.findIndex(
  (rate) => rate.id === user.userId,
);

// Update or Add Rating
if (existingRatingIndex !== -1) {
  recipe.rating[existingRatingIndex].rating = newRating;
} else {
  recipe.rating.push({ id: user.userId, rating: newRating });
}


// Save the Updated Reci
const updatedRecipe = await recipe.save();
return updatedRecipe;


};

const commentRecipe = async (
  recipeId: string,
  user: JwtPayload,
  comment: string,
) => {
  
};

const getAllRecipies = async () => {
  ;
};

const getSingleRecipe = async (id: string) => {
  
};

const deleteRecipe = async (recipeId: string) => {
 
};

const editRecipeComment = async (
  recipeId: string,
  commentId: string,
  newCommentText: string,
) => {
  
};

const getAllRecipiesForAdmin = async () => {
  
};

const unpublishRecipe = async (id: string) => {
 
};

const publishRecipe = async (id: string) => {
  
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