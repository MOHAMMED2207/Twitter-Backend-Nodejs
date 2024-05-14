const UserModel = require("../Model/Auth.cjs");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// --------------------------------------------------------------------------------------------------------
exports.register = async function (req, res) {
  try {
    let NewUser = new UserModel(req.body); // Data From UserModel(--all data in body--)
    // ========================= Validation =========================
    let FormatEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!FormatEmail.test(req.body.email)) {
      return res.status(400).json({ error: "Invalid Email Format " });
    }
    let NoRepetUserName = await UserModel.findOne({
      username: NewUser.username,
    });
    if (NoRepetUserName) {
      return res.status(400).json({
        error: "Username is already taken",
      });
    }
    let NoRepetPhone = await UserModel.findOne({ Phone: NewUser.Phone });
    if (NoRepetPhone) {
      return res.status(400).json({
        error: "Phone is already taken",
      });
    }
    let NoRepetEmail = await UserModel.findOne({ email: NewUser.email });
    if (NoRepetEmail) {
      return res.status(400).json({
        error: "Email is already taken",
      });
    }
    // ========================= Validation =========================
    // try catch to catch error
    const HandelPassword = await bcrypt.hash(req.body.Password, 10); // HandelPassword insiad work bcrypt.hash its need me 2 argument 1-req.body.Password 2-salt or number of time to hash
    NewUser.Password = HandelPassword; // old Password = new hash Password
    let user = await NewUser.save(); // save user in database
    // obj data from user becuase return this in res.json and i want to return this in userRegister

    let UserRegister = {
      // obj data from user
      _id: user._id,
      username: user.username,
      Password: user.Password,
      email: user.email,
      age: user.age,
      Phone: user.Phone,
      country: user.country,
      city: user.city,
      role: user.role,
      followers: user.followers,
      following: user.following,
      ProfileImg: user.ProfileImg,
      CoverImg: user.CoverImg,
      bio: user.bio,
      link: user.link,
    };
    return res.json({
      // return res.json
      Message: "User Register Succesfully", //msg
      status: 200, // story is succesd
      user: UserRegister, // data from user
    });
  } catch (err) {
    console.log(err); // log error
    return res.status(400).send({ Message: err }); //  status(400) is a bad request , send msg
  }
};
// --------------------------------------------------------------------------------------------------------
exports.login = async function (req, res) {
  try {
    const { Password } = req.body;
    let user = await UserModel.findOne({ email: req.body.email }); // find user in database
    const isPasswordCorrect = await bcrypt.compare(
      Password,
      user?.Password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // obj data from user becuase return this in res.json and i want to return this in userRegister
    const Token = Jwt.sign(
      {
        username: user.username,
        Password: user.Password,
        email: user.email,
        Phone: user.Phone,
        age: user.age,
        city: user.city,
        _id: user._id,
      },
      process.env.JWT_SECRET // secret key
    );

    let UserRegister = {
      // obj data from user
      username: user.username,
      Password: user.Password,
      email: user.email,
      Phone: user.Phone,
      city: user.city,
      role: user.role,
      token: Token,
    };

    return res.json({
      // return user data and token
      Message: "User Login Succesfully", // msg
      status: 200, // status(200) is a ok , send msg
      user: UserRegister, // user data
    });
  } catch (err) {
    console.log(err); // log error
    return res.status(400).send({ Message: err }); // return error
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token"); //
    return res.json({
      Message: "User Logout Succesfully", // msg
      status: 200, //
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ Message: err }); // return error
  }
};

exports.GetAllUser = async (req, res) => {
  try {
    let FilterUser = await UserModel.find(); // find user in database
    return res.json({
      // return res.json
      Message: "Data is Succesfully", //msg
      status: 200, // story is succesd
      user: FilterUser, // data from user
    });
  } catch (err) {
    console.log(err); // log error
    return res.status(400).send({ Message: err }); //  status(400) is a bad request , send msg
  }
};

exports.GetUserProfile = async (req, res) => {
  let userId = req.params.id
  try {
    let user = await UserModel.findOne({ _id: userId }).select("-Password"); // find user in database
		if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      // return res.json
      Message: "Data is Succesfully", //msg
      status: 200, // story is succesd
      user: user, // data from user
    });
  } catch (err) {
    console.log(err); // log error
    return res.status(400).send({ Message: err }); //  status(400) is a bad request , send msg
  }
};
