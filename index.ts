import "dotenv/config";
import express from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// データベース接続の準備
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
  log: ["query"],
});

const app = express();
const PORT = process.env.PORT || 8888;

// EJSを使う設定
app.set("view engine", "ejs");
app.set("views", "./views");

// フォームの内容を受け取る設定
app.use(express.urlencoded({ extended: true }));

// トップページ
app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.render("index", { users });
});

// ユーザー追加
app.post("/users", async (req, res) => {
  const name = req.body.name;

  if (name) {
    const newUser = await prisma.user.create({
      data: { name },
    });

    console.log("ユーザーを追加したぞ:", newUser);
  }

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
