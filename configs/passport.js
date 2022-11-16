const { getUserByWallet } = require("../models/user");

const passport = require("passport"),
  JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const jWTOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// jwt strategy for login
passport.use(
  new JwtStrategy(jWTOptions, async (payload, done) => {
    try {
      const results = getUserByWallet(payload.sub);

      if (results && payload.expiresIn > Date.now()) return done(null, results);

      return done(new Error("access token expired"), false);
    } catch (err) {
      done(err, false);
    }
  })
);

module.exports = passport;