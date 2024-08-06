const express = require("express");
const app = express();
const { Sequelize, Model, DataTypes } = require("sequelize");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.static("react-app/dist"));

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

app.get("/api/pirates/:id", (req, res) => {
  const id = req.params.id;
  const pirate = getPirate(id);
  if (!pirate) {
    res.status(404).send(`Pirate ${id} not found`);
  } else {
    res.send({ data: pirate });
  }
});

// Define User model
class User extends Model {}
User.init(
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);

// Sync models with database
sequelize.sync();

app.get("/api/seeds", async (req, res) => {
  const users = [
    { name: "John Doe", email: "john@example.com", password: "password1" },
    { name: "Jane Smith", email: "jane@example.com", password: "password2" },
    { name: "Mike Johnson", email: "mike@example.com", password: "password3" },
    {
      name: "Sarah Williams",
      email: "sarah@example.com",
      password: "password4",
    },
    { name: "David Brown", email: "david@example.com", password: "password5" },
  ];
  users.forEach((u) => User.create(u));
  // const users = await User.findAll();
  res.json(users);
});

app.post('/api/users', async (req, res) => {
    const user = await User.create(req.body);
    res.json(user);
  });
  
  // CRUD routes for User model
  app.get('/api/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
  });
  
  app.get('/api/users/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    res.json(user);
  });

function getPirate(id) {
  const pirates = [
    { id: 1, name: "Blackbeard", active: true, country: "England" },
    { id: 2, name: "Anne Bonny", active: true, country: "Ireland" },
    { id: 3, name: "Calico Jack", active: false, country: "England" },
    { id: 4, name: "Bartholomew Roberts", active: true, country: "Wales" },
    { id: 5, name: "Mary Read", active: false, country: "England" },
  ];
  return pirates.find((pirate) => pirate.id == id);
}

const port = process.env.PORT || 8080;
app.listen(port, async () => {
  console.log(`Server started at ${port}`);
});
