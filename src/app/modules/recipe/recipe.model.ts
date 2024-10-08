import mongoose from 'mongoose';
import { TRecipe } from './recipe.interface';

const RecipeSchema = new mongoose.Schema<TRecipe>(
  {
    user: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    upvote: {
      type: [String],
      required: true,
      default: [],
    },
    downvote: {
      type: [String],
      required: true,
      default: [],
    },
    comments: {
      type: [
        { id: String, name: String, profilePicture: String, comment: String },
      ],
      required: true,
      default: [],
    },
    rating: {
      type: [{ id: String, rating: Number }],
      required: true,
      default: [],
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: true,
    },
    isPremium: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const RecipeModel = mongoose.model<TRecipe>('Recipe', RecipeSchema);

export default RecipeModel;
