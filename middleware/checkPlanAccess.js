const users = require("../Model/userModel");

exports.checkPlanAccess = (feature) => {
    
    
  return async (req, res, next) => {
    console.log("inside the check planner");
    try {
      const email = req.payload;

      const user = await users.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // ❌ Block for free users
      if (
        user.plan === "free" &&
        (feature === "imagegenerator" || feature === "bgRemove")
      ) {
        return res.status(403).json({
          success: false,
          message: "Upgrade to Pro to use this feature",
        });
      }

      next();

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};