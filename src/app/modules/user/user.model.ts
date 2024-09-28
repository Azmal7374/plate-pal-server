import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { TUser } from './user.interface';
import config from '../../config';

const userSchema = new mongoose.Schema<TUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    premiumMembership: {
      type: 'Boolean',
      default: false,
    },
    bio: {
      type: String,
      default: '',
    },
    profilePicture: {
      type: String,
      default: 'https://i.ibb.co/HN9NtYY/user.png',
    },

    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    followers: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Followers',
    },

    recipes: { type: Schema.Types.ObjectId, required: true, ref: 'Recipe' },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

const UserModel = mongoose.model<TUser>('User', userSchema);

export default UserModel;
