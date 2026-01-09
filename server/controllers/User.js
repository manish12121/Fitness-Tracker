import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Workout from "../models/Workout.js";


dotenv.config();

export const UserRegister = async (req, res, next) => {
    try {
        const { email, name, password,img } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(createError(409, "Email already exists"));
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            img,  
        });

        const createdUser = await newUser.save();
        const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
            expiresIn: "9999 days",
        });
        return res.status(200).json({ token, newUser });
    } catch (err) {
        next(err);
    }
};


export const UserLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return next(createError(404, "User not found")).exec();
        }
        console.log(user);
        const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return next(createError(403, "Invalid password"));
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "9999 days",
        });
        return res.status(200).json({ token, user });
    } catch (err) {
        next(err);
    }
};

export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) return next(createError(404, "User not found"));

    const today = new Date();

    /* =========================
        TODAY RANGE
    ========================= */
    const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    /* =========================
        LAST 7 DAYS RANGE
    ========================= */
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date();
    weekEnd.setHours(23, 59, 59, 999);

    /* =========================
        TODAY TOTALS
    ========================= */
    const totalCaloriesAgg = await Workout.aggregate([
      { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
      { $group: { _id: null, totalCaloriesBurnt: { $sum: "$caloriesBurned" } } },
    ]);

    const totalCaloriesBurnt =
      totalCaloriesAgg.length > 0 ? totalCaloriesAgg[0].totalCaloriesBurnt : 0;

    const totalWorkouts = await Workout.countDocuments({
      user: user._id,
      date: { $gte: startToday, $lt: endToday },
    });

    const avgCaloriesBurnedPerWorkout =
      totalWorkouts > 0 ? totalCaloriesBurnt / totalWorkouts : 0;

    /* =========================
        PIE CHART (WEEKLY)
    ========================= */
    const categoryCalories = await Workout.aggregate([
      {
        $match: {
          user: user._id,
          date: { $gte: weekStart, $lte: weekEnd },   // ✅ WEEK DATA
        },
      },
      {
        $group: {
          _id: "$category",
          totalCaloriesBurnt: { $sum: "$caloriesBurned" },
        },
      },
    ]);

    const pieChartData = categoryCalories.map((c, i) => ({
      id: i,
      value: c.totalCaloriesBurnt,
      label: c._id,
    }));

    /* =========================
        BAR CHART (7 DAYS)
    ========================= */
    const weeks = [];
    const caloriesBurned = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      weeks.push(`${date.getDate()}th`);

      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

      const dayData = await Workout.aggregate([
        { $match: { user: user._id, date: { $gte: startOfDay, $lt: endOfDay } } },
        { $group: { _id: null, totalCaloriesBurnt: { $sum: "$caloriesBurned" } } },
      ]);

      caloriesBurned.push(dayData[0]?.totalCaloriesBurnt || 0);
    }

    /* =========================
        SEND RESPONSE
    ========================= */
    return res.status(200).json({
      totalCaloriesBurnt,
      totalWorkouts,
      avgCaloriesBurnedPerWorkout,
      pieChartData,
      totalWeeksCaloriesBurnt: {
        weeks,
        caloriesBurned,
      },
    });
  } catch (err) {
    next(err);
  }
};



export const getWorkoutsByDate = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const user = await User.findById(userId);
        let date = req.query.date ? new Date(req.query.date) : new Date();
        if (!user) {
            return next(createError(404, "User not found"));
        }

        const startOfDay = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );
        const endOfDay = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 1
        );

        const todaysWorkouts = await Workout.find({
            user: user._id,
            date: { $gte: startOfDay, $lt: endOfDay },
        });

        const totalCaloriesBurnt = todaysWorkouts.reduce(
            (total, workout) => total + workout.caloriesBurned,
            0
        );

        return res.status(200).json({ todaysWorkouts, totalCaloriesBurnt });
    } catch (err) {
        next(err);
    }
};

export const addWorkout = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { workoutString } = req.body;
        if (!workoutString) {
            return next(createError(400, "Workout data is required"));
        }

        // Split workoutString into lines
        const eachworkout = workoutString.split(";").map(line => line.trim());
        //check if any workouts starts with "#" to indicate categories
        const categories = eachworkout.filter(line => line.startsWith("#"));
        if (categories.length === 0) {
            return next(createError(400, "At least one category is required, start with #"));
        }

        let currentCategory = "";
        const parsedWorkouts = [];
        let count = 0;

        // Loop through each line to parse workouts details
        await eachworkout.forEach(line => {
            count++;
            if (line.startsWith("#")) {
                const parts = line?.split("\n").map((part) => part.trim());
                console.log(parts);
                if (parts.length < 5){
                    return next(
                        createError(400, `Workout string is missing for ${count}th workout`)
                    );
                }
                // Update current category 
                currentCategory = parts[0].substring(1).trim();
                // Extract workout details
                const workoutDetails = parseWorkoutLine(parts);
                if (workoutDetails == null) {
                    return next(createError(400, "Please enter in proper formate"))
                }

                if(workoutDetails){
                    // add category to workout details
                    workoutDetails.category = currentCategory;
                    parsedWorkouts.push(workoutDetails);
                }
            }else{
                return next(
                    createError(400, `Workout string is missing for ${count}th workout`)
                );
            }
        });

        await parsedWorkouts.forEach(async (workout)=> {
            workout.caloriesBurned = parseFloat(calculateCaloriesBurnt(workout));
            await Workout.create({...workout, user: userId });
        });
        return res.status(201).json({
            message: "Workouts added successfully",
            workouts: parsedWorkouts,
        });
    } catch (err) {
        next(err);
    }
};


// Function to parse workout details from a line
const parseWorkoutLine = (parts) => {
  const details = {};
  console.log(parts);
  if (parts.length >= 5) {
    details.workoutName = parts[1].substring(1).trim();
    details.sets = parseInt(parts[2].split("sets")[0].substring(1).trim());
    details.reps = parseInt(
      parts[2].split("sets")[1].split("reps")[0].substring(1).trim()
    );
    details.weight = parseFloat(parts[3].split("kg")[0].substring(1).trim());
    details.duration = parseFloat(parts[4].split("min")[0].substring(1).trim());
    console.log(details);
    return details;
  }
  return null;
};

// Function to calculate calories burnt for a workout
const calculateCaloriesBurnt = (workoutDetails) => {
  const durationInMinutes = parseInt(workoutDetails.duration);
  const weightInKg = parseInt(workoutDetails.weight);
  const caloriesBurntPerMinute = 5; // Sample value, actual calculation may vary
  return durationInMinutes * caloriesBurntPerMinute * weightInKg;
};
