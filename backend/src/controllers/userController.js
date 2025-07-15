import authUser from "../middlewares/userAuth.js";
import LoveCalculation from "../models/loveCalculationModel.js";
import User from "../models/userModel.js";

export const getUserData = async (req, res) => {
  const { email } = req.user;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  try {
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const saveLoveCalculation = async (req, res) => {
  try {
    const {
      yourName,
      yourAge,
      yourEducation,
      crushName,
      crushAge,
      crushEducation,
      relationshipDays,
      relationshipMonths,
      lovePercentage,
      idPin,
    } = req.body;

    // Get user ID from authenticated user
    const user = await User.findOne({ idPin });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Your PIN is wrong",
      });
    }

    // Save the calculation
    const calculation = new LoveCalculation({
      yourName,
      yourAge,
      yourEducation,
      crushName,
      crushAge,
      crushEducation,
      relationshipDays,
      relationshipMonths,
      lovePercentage,
      idPin,
      calculatedAt: new Date(),
    });

    await calculation.save();

    res.status(201).json({
      success: true,
      message: "Love calculation saved successfully",
    });
  } catch (error) {
    console.error("Error saving calculation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getLoveHistory = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const calculations = await LoveCalculation.find({ idPin: req.user.idPin })
      .sort({ calculatedAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      calculations,
    });
  } catch (error) {
    console.error("Error fetching calculations:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteLoveHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the calculation to verify it exists and belongs to the user
    const calculation = await LoveCalculation.findOne({
      _id: id,
      idPin: req.user.idPin,
    });

    if (!calculation) {
      return res.status(404).json({
        success: false,
        message:
          "Calculation not found or you don't have permission to delete it",
      });
    }

    // Delete the calculation
    await LoveCalculation.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Calculation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting calculation:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
