import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_acess_token_secret: process.env.JWT_ACCESS_SECRET,
  access_token_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_token_secret: process.env.JWT_REFRESH_SECRET,
  refresh_token_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  store_id: process.env.STORE_ID,
  signature_key: process.env.SIGNATURE_KEY,
  payment_url: process.env.PAYMENT_URL,
  payment_verification_url: process.env.PAYMENT_VERIFICATION_URL,
};
