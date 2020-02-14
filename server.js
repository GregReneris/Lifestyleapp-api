const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const databaseUrl = "lifestyle";
const collections = ["users", "completedActivities"];
const db = mongojs(databaseUrl, collections);

const db = require("./models");


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/lifestyle", { useNewUrlParser: true });

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});