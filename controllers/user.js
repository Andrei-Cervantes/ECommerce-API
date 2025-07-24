import User from "../models/User.js";
import auth from "../auth.js";
import bcrypt from "bcrypt";

const userController = () => {
  // Controller for user registration
  const registerUser = (req, res) => {
    User.findOne({ email: req.body.email })
      .then((existingUser) => {
        if (existingUser) {
          return res.status(409).send({ error: "Email already exists" });
        }
        if (!req.body.email.includes("@")) {
          return res.status(400).send({ error: "Email invalid" });
        } else if (req.body.mobileNo.length !== 11) {
          return res.status(400).send({ error: "Mobile number invalid " });
        } else if (req.body.password.length < 8) {
          return res
            .status(400)
            .send({ error: "Password must be atleast 8 characters" });
        } else {
          let newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobileNo: req.body.mobileNo,
            password: bcrypt.hashSync(req.body.password, 10),
          });

          return newUser
            .save()
            .then((result) => {
              res.status(201).send({ message: "Registered Successfully" });
              console.log(result);
            })
            .catch((err) => {
              console.error("Error in saving: ", err);
              return res.status(500).send({ error: "Error in save" });
            });
        }
      })
      .catch((err) => {
        console.error("Error in finding users", err);
        return res.status(500).send({ error: "Error in finding users" });
      });
  };

  // Controller for user authentication
  const loginUser = (req, res) => {
    if (req.body.email.includes("@")) {
      return User.findOne({ email: req.body.email })
        .then((result) => {
          if (result == null) {
            return res.status(404).send({ error: "No Email Found" });
          } else {
            const isPasswordCorrect = bcrypt.compareSync(
              req.body.password,
              result.password
            );

            if (isPasswordCorrect) {
              return res
                .status(200)
                .send({ accessToken: auth.createAccessToken(result) });
            } else {
              return res
                .status(401)
                .send({ message: "Email and password do not match" });
            }
          }
        })
        .catch((err) => {
          console.error("Error in find: ", err);
          return res.status(500).send({ error: "Error in find" });
        });
    } else {
      return res.status(400).send({ error: "Invalid Email" });
    }
  };

  const updatePassword = (req, res) => {
    // Check if password length is more than 8 characters
    if (!req.body.password || req.body.password.length < 8) {
      return res
        .status(400)
        .send({ error: "Password must be at least 8 characters" });
    } else {
      const newPassword = {
        password: bcrypt.hashSync(req.body.password, 10),
      };

      return User.findByIdAndUpdate(req.user.id, newPassword)
        .then((result) => {
          res.status(200).send({ message: "Password updated successfully" });
        })
        .catch((err) => {
          console.error("Error in updating password", err);
          return res.status(500).send({ error: "Failed to update password" });
        });
    }
  };

  // Code For Retrieve User Details
  const getProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      user.password = "";
      res.status(200).send(user);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  };

  // Code For Set User as Admin (Admin Only)
  const setUserAsAdmin = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      if (!req.user.isAdmin) {
        return res.status(403).send({
          message: "Permission denied. Only admins can set users as admins.",
        });
      }

      user.isAdmin = true;
      await user.save();
      res
        .status(200)
        .send({ message: "User has been set as admin successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  };

  return {
    registerUser,
    loginUser,
    updatePassword,
    getProfile,
    setUserAsAdmin,
  };
};

export default userController;
