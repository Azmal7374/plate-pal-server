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
 
};

const downvoteRecipe = async (recipeId: string, user: JwtPayload) => {
  
};

const rateRecipe = async (
  recipeId: string,
  user: JwtPayload,
  newRating: number,
) => {
  
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