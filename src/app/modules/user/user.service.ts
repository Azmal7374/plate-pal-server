import { JwtPayload } from 'jsonwebtoken';
import { TUser } from './user.interface';
import UserModel from './user.model';
import RecipeModel from '../recipe/recipe.model';
import { initiatePayment, verifyPayment } from '../../utils/PaymentGateWay/PaymentGateway';


const createUser = async (payload: TUser) => {
  const isUserAlreadyExists = await UserModel.findOne({ email: payload.email });

  if (isUserAlreadyExists) {
    throw new Error('User already exists!');
  }

  const result = await UserModel.create(payload);
  return result;
};

const getSingleUser = async (id: string) => {
  const userData = await UserModel.findById(id);
  const userPostedRecipeData = await RecipeModel.find({ user: id });

  return { userData, userPostedRecipeData };
};

const getUserInfo = async (id: string) => {
  const userData = await UserModel.findById(id);

  return userData;
};

const updateProfile = async (userId: string, updateData: Partial<TUser>) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error('User not found!');
  }

  if(updateData.email){
    const existingUser = await UserModel.findOne({email: updateData.email});
    if(existingUser && existingUser._id.toString() !==userId){
      throw new Error('Email Already in User!')
    }
  }
   const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData,{
    new:true,
   })

  
  return updatedUser;
};

const addToFollowing = async (id: string, user: JwtPayload) => {
  // Fetching Current User:
  const currentUser = await UserModel.findById(user.userId);

  // Check if Current User Exists:
  if (!currentUser) {
    throw new Error('Current user not found!');
  }

// Check if Already Following:
  if(currentUser.following.includes(id)){
    throw new Error('You are Already Follwing This User')
  }

//  Add User to Following List:
  const updatedUser = await UserModel.findByIdAndUpdate(
    user.userId,
    {
      $addToSet:{following:id},
    },
    {new: true}
  )

  if(!updatedUser){
    throw new Error('You failed to update following list')
  }

  // Update Followed User's Followers List:
  await UserModel.findByIdAndUpdate(id,{
    $addToSet:{followers:user.userId},
  });
  return updatedUser
 
};

const removeFromFollowing = async (id: string, user: JwtPayload) => {
  const currentUser = await UserModel.findById(user.userId);

  // Check if Current User Exists:
  if (!currentUser) {
    throw new Error('Current user not found!');
  }

  // Check if Following the User:
  if (!currentUser.following.includes(id)) {
    throw new Error('You are not following this user.');
  }
 
  // Remove User from Following List:

  const updatedUser = await UserModel.findByIdAndUpdate(
    user.userId,
    {
      $pull:{following:id}
    },
    {new:true},
  )

  // Update Followed User's Followers List:
  await UserModel.findByIdAndUpdate(id,{
    $pull:{followers:user.userId},
  })

  // Return Updated User:
  return updatedUser;
};

const becomePremiumMember = async (payload: any) => {
  const user = await UserModel.findById(payload.id);

  if(user){
    // Update the User's Transaction ID:
    const updatedUser = await UserModel.findByIdAndUpdate(
      payload.id,
      {transactionId:payload.transactionId},
      {new:true},
    )
    // Check if the User was Updated:
    if(!updatedUser){
      throw new Error('Error updating user');
    }
// Initialize the Payment Process:
    const initializePayment = await initiatePayment(payload);

    // Return the Payment Initialization Result:
    return initializePayment;
  }
  // Handle User Not Found:
  else{
    throw new Error('User Not Found')
  }  
};

const paymentConfirmation = async (transactionId: string) => {
  
  let templateForSuccessfulPayment = `
   <html>
  <head>
    <link
      href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap"
      rel="stylesheet"
    />
  </head>
  <style>
    body {
      text-align: center;
      padding: 40px 0;
      background: #ebf0f5;
    }
    h1 {
      color: #88b04b;
      font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif;
      font-weight: 900;
      font-size: 40px;
      margin-bottom: 10px;
    }
    p {
      color: #404f5e;
      font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif;
      font-size: 20px;
      margin: 0;
    }
    i {
      color: #9abc66;
      font-size: 100px;
      line-height: 200px;
      margin-left: -15px;
    }
    .card {
      background: white;
      padding: 60px;
      border-radius: 4px;
      box-shadow: 0 2px 3px #c8d0d8;
      display: inline-block;
      margin: 0 auto;
    }

    button {
      background-color: #fb8c00;
      border: 1px solid rgb(209, 213, 219);
      border-radius: 0.5rem;
      color: white;
      font-family:
        ui-sans-serif,
        system-ui,
        -apple-system,
        system-ui,
        'Segoe UI',
        Roboto,
        'Helvetica Neue',
        Arial,
        'Noto Sans',
        sans-serif,
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji';
      font-size: 20px;
      margin-top: 30px;
      font-weight: 600;
      line-height: 1.25rem;
      padding: 0.75rem 1rem;
      text-align: center;
      -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      cursor: pointer;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-user-select: none;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
    }
  </style>
  <body>
    <div class="card">
      <div
        style="
          border-radius: 200px;
          height: 200px;
          width: 200px;
          background: #f8faf5;
          margin: 0 auto;
        "
      >
        <i class="checkmark">✓</i>
      </div>
      <h1>Payment Successful!</h1>

      <button onclick="window.location.href='';">
        Go To Your Dashboard
      </button>
    </div>
  </body>
</html>

  `;

  const templateForFailedPayment = `
   <html>
  <head>
    <link
      href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap"
      rel="stylesheet"
    />
  </head>
  <style>
    body {
      text-align: center;
      padding: 40px 0;
      background: #ebf0f5;
    }
    h1 {
      color: red;
      font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif;
      font-weight: 900;
      font-size: 40px;
      margin-bottom: 10px;
    }
    p {
      color: #404f5e;
      font-family: 'Nunito Sans', 'Helvetica Neue', sans-serif;
      font-size: 20px;
      margin: 0;
    }
    i {
      color: red;
      font-size: 100px;
      line-height: 200px;
      margin-left: -15px;
    }
    .card {
      background: white;
      padding: 60px;
      border-radius: 4px;
      box-shadow: 0 2px 3px #c8d0d8;
      display: inline-block;
      margin: 0 auto;
    }

    button {
      background-color: #fb8c00;
      border: 1px solid rgb(209, 213, 219);
      border-radius: 0.5rem;
      color: white;
      font-family:
        ui-sans-serif,
        system-ui,
        -apple-system,
        system-ui,
        'Segoe UI',
        Roboto,
        'Helvetica Neue',
        Arial,
        'Noto Sans',
        sans-serif,
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
        'Noto Color Emoji';
      font-size: 20px;
      margin-top: 30px;
      font-weight: 600;
      line-height: 1.25rem;
      padding: 0.75rem 1rem;
      text-align: center;
      -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      cursor: pointer;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-user-select: none;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
    }
  </style>
  <body>
    <div class="card">
      <div
        style="
          border-radius: 200px;
          height: 200px;
          width: 200px;
          background: #f8faf5;
          margin: 0 auto;
        "
      >
        <i class="checkmark">❌</i>
      </div>
      <h1>Payment Failed!</h1>

      <button onclick="window.location.href='';">
        Go To Homepage
      </button>
    </div>
  </body>
</html>

  `;

 
};

const getAllUser = async () => {
  const userData = await UserModel.find({ role: 'user' });
  return userData;
};

const blockUser = async (id: string) => {

};

const unblockUser = async (id: string) => {
  
};

const deleteUser = async (id: string) => {
  
};

const createAdmin = async (payload: TUser) => {
  
};

const getAllAdmin = async () => {
  const result = await UserModel.find({ role: 'admin' });

  return result;
};

const updateAdminProfile = async (
  userId: string,
  updateData: Partial<TUser>,
) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error('User not found!');
  }

};

const deleteAdmin = async (id: string) => {
  const user = await UserModel.findByIdAndDelete(id);

  return user;
};

export const UserServices = {
  createUser,
  updateProfile,
  addToFollowing,
  removeFromFollowing,
  getSingleUser,
  getUserInfo,
  becomePremiumMember,
  paymentConfirmation,
  getAllUser,
  blockUser,
  unblockUser,
  deleteUser,
  createAdmin,
  getAllAdmin,
  updateAdminProfile,
  deleteAdmin,
};