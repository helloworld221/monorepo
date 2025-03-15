import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";
import { env } from "./env";

dotenv.config();

const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET || "";
const CALLBACK_URL =
  env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback";

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error("Missing Google OAuth credentials");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        console.log("Google auth callback received", { profileId: profile.id });
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails?.[0]?.value || "",
            name: profile.displayName,
            picture: profile.photos?.[0]?.value,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
