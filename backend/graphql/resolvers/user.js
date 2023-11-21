const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const User = require("../../models/user");
const HttpError = require("../../error/http-error");

const validateUser = (email, password) => {
  const errors = [];
  if (!validator.isEmail(email)) {
    errors.push({ message: "E-mail is not valid!" });
  }
  if (
    validator.isEmpty(password) ||
    !validator.isLength(password, { min: 6 })
  ) {
    errors.push({ message: "Password too short!" });
  }

  return errors;
};

module.exports = {
  createUser: async ({ userInput }) => {
    const { email, password } = userInput;

    const errors = validateUser(email, password);
    if (errors.length > 0) {
      const error = new HttpError(
        "Invalid inputs, please check your data.",
        422
      );
      throw error;
    }

    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, please try again later.",
        500
      );
      throw error;
    }

    if (existingUser) {
      const error = new HttpError("User exists already.", 422);
      throw error;
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, please try again later.",
        500
      );
      throw error;
    }

    const user = new User({
      email: email,
      password: hashedPassword,
    });

    let createdUser;
    try {
      createdUser = await user.save();
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, please try again later.",
        500
      );
      throw error;
    }

    const token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    return {
      userId: createdUser.id,
      token,
      tokenExpiration: 1,
    };
  },
  login: async ({ email, password }) => {
    const errors = validateUser(email, password);
    if (errors.length > 0) {
      const error = new HttpError(
        "Invalid inputs, please check your data.",
        422
      );
      throw error;
    }

    let user;
    try {
      user = await User.findOne({ email: email });
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, please try again later.",
        500
      );
      throw error;
    }

    if (!user) {
      const error = new HttpError("User does not exist.", 404);
      throw error;
    }

    let isPasswordMatched;
    try {
      isPasswordMatched = await bcrypt.compare(password, user.password);
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, please try again later.",
        500
      );
      throw error;
    }

    if (!isPasswordMatched) {
      const error = new HttpError("Password is incorrect.", 422);
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    return {
      userId: user.id,
      token,
      tokenExpiration: 1,
    };
  },
};
