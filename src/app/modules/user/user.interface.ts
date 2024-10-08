export type TUser = {
  email: string;
  password: string;
  name: string;
  role: string;
  profilePicture: string;
  bio: string;
  premiumMembership: boolean;
  followers: string[];
  following: string[];
  isBlocked: boolean;
  transactionId: string;
};
