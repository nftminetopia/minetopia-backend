const passport = require("passport"),
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../models/user");

const jWTOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// jwt strategy for login
passport.use(
  new JwtStrategy(jWTOptions, async (payload, done) => {
    try {
      const results = await User.findOne({ wallet: payload.sub });
      if (results && payload.expiresIn > Date.now()) return done(null, results);
      return done(new Error("access token expired"), false);
    } catch (err) {
      done(err, false);
    }
  })
);

module.exports = passport;
