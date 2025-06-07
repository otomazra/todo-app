import express from "express";
import { body, validationResult } from "express-validator";
import { Pool } from "pg";
import env from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import helmet from "helmet";
import cors from "cors";
// import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(helmet());
app.use(cors());
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
env.config();


console.log(process.env.JWT_SECRET);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl : {rejectUnauthorized: false,}
  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  // port: process.env.DB_PORT,
});
// module.exports = pool

// db.connect();

const hashPassword = async (password) => {
  let saltRounds = parseInt(process.env.SALTROUNDS) || 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

const comparePassword = async (password, hashedPassword) => {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
};

const jwtToken = (userData) => {
  const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "1h" });
  console.log("User authenticated: ", userData.email);
  return token;
};

const checkUser = async (userEmail) => {
  // const result = await db.query("SELECT * FROM users WHERE email = $1", [
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    userEmail,
  ]);
  return result.rows.length > 0;
};

const enterSystem = async (user) => {
  const email = user.email;
  const password = user.password;
  const result = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);
  const data = result.rows[0];
  console.log(data);
  if (!data || data == undefined) {
    return null;
  }

  const comparison = await comparePassword(password, data.password_hash);
  const token = jwtToken({ userId: data.id, email: data.email });

  if (!comparison) return null;
  return token;
};

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      console.log(req.user);
      next();
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const insertUserData = async (user) => {
  const insertData = await pool.query(
    "INSERT INTO users (email, password_hash, first_name, last_name) VALUES($1,$2,$3,$4) RETURNING *",
    [user.email, user.password, user.firstName, user.lastName]
  );
  console.log(insertData.rows[0]);
  return insertData.rows[0];
};

const insertTodoInfo = async (todoInfo) => {
  let userId = todoInfo.userId;
  let todo = todoInfo.todo;
  const result = await pool.query(
    "INSERT INTO todolist (todo, user_id) VALUES ($1, $2) RETURNING *",
    [todo, userId]
  );
  const data = result.rows[0];
  if (!data) return null;
  console.log(data);
  return data;
};

app.get("/", (req, res) => {
  res.json("Main page. Go to /register for registration");
});

app.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").notEmpty().withMessage("Password not typed"),
  ],
  async (req, res) => {
    // let email = req.body.email;
    // let password = req.body.password;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const checking = await enterSystem(req.body);
      if (checking) {
        return res.json({ token: checking });
      } else {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.post(
  "/register",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").isLength({ min: 6 }),
    body("confirmPassword")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let email = req.body.email;
      let password = req.body.password;
      let confirmPassword = req.body.confirmPassword;
      let firstName = req.body.firstName;
      let lastName = req.body.lastName;
      if (password === confirmPassword) {
        if (!(await checkUser(email))) {
          const hash = await hashPassword(password);
          const userData = { email, password: hash, firstName, lastName };
          console.log(userData);
          const data = await insertUserData(userData);
          console.log("Registration data inserted into the DB: ", data);
          const token = await enterSystem({ email, password });
          console.log({
            message: "Registration successful, here is your token: ",
            token,
          });
          res.json({ token });
        } else {
          res.status(400).json({ message: "This email is already in use" });
        }
      } else {
        res.status(400).json("Passwords do not match");
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    console.log({ message: "Welcome", user: req.user });
    // const {userId, email} = req.user;
    // console.log(userId, email);
    const data = await pool.query(
      "SELECT todolist.id, todo FROM todolist JOIN users ON todolist.user_id = users.id WHERE user_id=$1",
      [req.user.userId]
    );
    console.log(data.rows);
    res.json(data.rows);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post(
  "/create",
  authenticateToken,
  [body("todo").notEmpty().withMessage("Todo field is empty")],
  async (req, res) => {
    console.log(req.body.todo);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let userId = req.user.userId;
      let todo = req.body.todo;
      // const todoInfo = {userId: userId, todo: todo};
      const result = await insertTodoInfo({ todo, userId });
      res.status(201).json({ message: "Todo created", todo: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.delete("/delete/:todoId", authenticateToken, [
  
], async (req, res) => {
  try {
    const userId = req.user.userId;
    const todoId = req.params.todoId;
    console.log(userId, todoId);
    const checkData = await pool.query(
      "SELECT * FROM todolist WHERE user_id = $1 AND id=$2",
      [userId, todoId]
    );
    console.log(checkData.rows);
    if (!(checkData.rows.length>0) || checkData==undefined) {
      return res.status(401).json({
        message:
          "Unauthorized trespassing. The data you are trying to access does not belong to you. You may have your account blocked.",
      });
    }
    const result = await pool.query(
      "DELETE FROM todolist WHERE user_id=$1 AND id=$2 RETURNING *",
      [userId, todoId]
    );
    const data = result.rows[0];
    console.log(data);
    res.json({ success: true, deletedTodoId: data.id, });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch(
  "/update/:todoId",
  [body("newTodo").notEmpty().withMessage("todo field is emtpy")],
  authenticateToken,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const userId = req.user.userId;
      const todoId = req.params.todoId;
      const newTodo = req.body.newTodo;
      const result = await pool.query(
        "UPDATE todolist SET todo = $1 WHERE user_id = $2 AND id = $3 RETURNING *",
        [newTodo, userId, todoId]
      );
      const data = result.rows[0];
      console.log(data);
      res.json({ success: true, updatedTodoId: data.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.listen(process.env.PORT, () => {
  console.log("Listening to port: " + process.env.PORT);
});
