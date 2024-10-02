import { JwtPayload } from "jsonwebtoken";
import { TRecipe } from "./recipe.interface";
import UserModel from "../user/user.model";
import RecipeModel from "./recipe.model";



const createRecipe = async (payload:TRecipe, user:JwtPayload) =>{
  const userRecord = await UserModel.findById(user.userId);

  if(!userRecord){
    throw new Error("User Not Found");
  }

  if(userRecord.isBlocked){
    throw new Error("Your Account has Been Blocked")
  }
  payload.user = user.userId;

  if(payload.isPremium){
    payload.isPremium =true
  }

  const result = await  RecipeModel.create(payload)
  return result;

}


const upvoteRecipe = async (recipeId:string, user: JwtPayload) => {
const recipe = await RecipeModel.findById(recipeId)
if(!recipe) {
 throw new Error("Recipe Not Found")
}
if(recipe.upvote.includes(user.userId)){
  throw new Error("You have already voted recipe")
}

if(recipe.downvote.includes(user.userId)){
  await RecipeModel.findByIdAndUpdate(
    recipeId,
    {
      $pull:{downvote:user.userId},
    },
    {new:true}
  )
}
const updateRecipe = await RecipeModel.findByIdAndUpdate(
  recipeId,
  {
    $addToSet:{upvote:user.userId}
  },
  {new:true}
)
return updateRecipe
}


const downvoteRecipe = async (recipeId: string, user: JwtPayload) => {
  const recipe = await RecipeModel.findById(recipeId);

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  let userHasUpvoted = false;
  if (recipe.upvote.includes(user.userId)) {
    userHasUpvoted = true;
    await RecipeModel.findByIdAndUpdate(
      recipeId,
      {
        $pull: { upvote: user.userId },
      },
      { new: true },
    );
  }

  if (!userHasUpvoted && recipe.downvote.length === 0) {
    throw new Error('Downvote is already zero.');
  }

  if (recipe.downvote.includes(user.userId)) {
    throw new Error('You have already downvoted this recipe');
  }

  const updatedRecipe = await RecipeModel.findByIdAndUpdate(
    recipeId,
    {
      $addToSet: { downvote: user.userId },
    },
    { new: true },
  );
  return updatedRecipe;
};


const  rateRecipe = async (recipeId: string, user:JwtPayload, newRating:number)=>{
  const recipe = await RecipeModel.findById(recipeId);

  if(!recipe){
    throw new Error("Recipe Not Found");
  }
  const existingRating = recipe.rating.findIndex((r)=>r.id === user.userId,
);

if(existingRating !==-1){
  recipe.rating[existingRating].rating = newRating;
}else{
  recipe.rating.push({id:user.userId, rating:newRating})
}

const updateRecipe = await recipe.save();
return updateRecipe
}

const commentRecipe = async(recipeId:string, user:JwtPayload, comment:string) =>{
  const recipe = await RecipeModel.findById(recipeId);
  if(!recipe){
    throw new Error("Recipe not found")
  }

  recipe.comments.push({
    id:user.userId,
    name:user.name,
    profilePicture:user.profilePicture,
    comment:comment
  })
  const updateRecipe = await recipe.save();
  return updateRecipe;
}

const getAllRecipe = async ()=>{
  const result = RecipeModel.find({ isPublished:false})
  return result
}


const getSingleRecipe = async (id: string) => {
  const result = await RecipeModel.findById(id);

  const postOwner = await UserModel.findById(result?.user);

  return { result, postOwner };
};


const deleteRecipe =async(recipeId: string)=>{
  const result = await RecipeModel.findByIdAndDelete(recipeId);
  return  result
}

const editRecipeComment = async(recipeId: string, commentId:string, newComment: string) =>{
const updateRecipe = await RecipeModel.findOneAndUpdate({
  _id:recipeId,
  'comments._id':commentId,
},
{
  $set:{'comments.$.comment':newComment},
},
{new:true}
);

if(!updateRecipe){
  throw new Error('comment not found')
}
return updateRecipe

}

const getAllRecipiesForAdmin = async()=>{
  const result = await RecipeModel.find();
  return result
}

const unPublishRecipe = async(id:string)=>{
  const recipe = await RecipeModel.findOneAndUpdate(
    {_id:id},
    {isPublished: false},
    {new: true},
    )
    return recipe;
}


const  puslishRecipe = async(id:string)=>{
  const recipe = await RecipeModel.findOneAndUpdate(
    {_id:id},
    {isPublished:true},
    {new:true},
  )
  return recipe;
}

export const RecipeServices={
  createRecipe,
  upvoteRecipe,
  downvoteRecipe,
  rateRecipe,
  commentRecipe,
  deleteRecipe,
  getAllRecipe,
  getSingleRecipe,
  editRecipeComment,
  getAllRecipiesForAdmin,
  unPublishRecipe,
  puslishRecipe,
}