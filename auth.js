import jwt from "jsonwebtoken";

const secret = "ECommerceAPI";

const auth = () => {
  const createAccessToken = (user) => {
    const data = {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    return jwt.sign(data, secret, {});
  };

  // Token verification
  const verify = (req, res, next) => {
    console.log(req.headers.authorization);

    let token = req.headers.authorization;

    if (typeof token === "undefined") {
      return res.send({ auth: "Failed. No Token." });
    } else {
      console.log(token);
      token = token.slice(7, token.length);
      console.log(token);

      // Token decryption
      jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
          return res.send({
            auth: "Failed",
            message: err.message,
          });
        } else {
          console.log("Result from verify method:");
          console.log(decodedToken);

          req.user = decodedToken;
          next();
        }
      });
    }
  };

  // Verify admin
  const verifyAdmin = (req, res, next) => {
    console.log("Result from verifyAdmin method:");
    console.log(req.user);

    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).send({
        auth: "Failed",
        message: "Action Forbidden",
      });
    }
  };

  // Check if user is authenticated
  const isLoggedIn = (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.sendStatus(401);
    }
  };

  return { createAccessToken, verify, verifyAdmin, isLoggedIn };
};

export default auth;
