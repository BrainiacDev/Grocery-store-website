import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.cookies.accessToken || req.headers?.authorization?.split(" ")[1]; //["Bearer", "token"]
      //   const token =
      // req.cookies?.accessToken ||
      // (req.header("Authorization")?.startsWith("Bearer ")
      //   ? req.header("Authorization").split(" ")[1]
      //         : null);
      
    console.log("token", token);

    if (!token) {
      return res.status(401).json({
        message: "Provide token",
      });
    }

    const decode = jwt.verify(token, process.env.SECRETE_KEY_ACCESS_TOKEN);
    console.log("Decode", decode);
    if (!decode) {
      return res.status(401).json({
        message: "Unauthorized access",
        error: true,
        success: false,
      });
    }

    req.userId = decode.id;

    next();
  } catch (error) {
      console.error("Auth Middleware Error:", error.message);



      // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired",
        error: true,
        success: false,
      });
    }

      if (error.name === "JsonWebTokenError") {
          return res.status(401).json({
              message: "Invalid token",
              error: true,
              success: false,
          });
      }


    return res.status(500).json({
      message: "An unexpected error occurred",
      error: true,
      success: false,
    });
  }
};

export default auth;
