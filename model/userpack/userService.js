const addGoogleUser =
  (User) =>
  ({ googleId, email, firstname, lastname, profilePhoto }) => {
    console.log(googleId, email, firstname, lastname, profilePhoto);

    const user = new User({
      googleId,
      email: email.toLowerCase(),
      firstname,
      lastname,
      profilePhoto,
      source: "google",
    });
    return user.save();
  };

const addLocalUser =
  (User) =>
  ({ id, email, firstname, lastname, password }) => {
    const user = new User({
      id,
      email: email.toLowerCase(),
      firstname,
      lastname,
      password,
      source: "local",
    });
    return user.save();
  };

const getUsers = (User) => () => {
  return User.find({});
};

const getUserByEmail =
  (User) =>
  async ({ email }) => {
    return await User.findOne({ email: email.toLowerCase() });
  };

module.exports = (User) => {
  return {
    addGoogleUser: addGoogleUser(User),
    addLocalUser: addLocalUser(User),
    getUsers: getUsers(User),
    getUserByEmail: getUserByEmail(User),
  };
};
