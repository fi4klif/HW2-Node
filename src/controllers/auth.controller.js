import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { prisma } from "../../prisma/client.js";

// --- РЕЄСТРАЦІЯ ---
export const register = async (req, res, next) => {
  try {
    const { username, password, name } = req.body;

    // 1. Перевіряємо, чи існує користувач
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      throw createHttpError(409, "Користувач з таким username вже існує");
    }

    // 2. Хешуємо пароль (10 - це salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Створюємо користувача
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
      },
    });

    // 4. Генеруємо токени
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    // 5. Зберігаємо Refresh-токен у базу
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
      },
    });

    // 6. Встановлюємо HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
    });

    // 7. Повертаємо Access-токен та дані користувача без пароля
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      accessToken,
      user: userWithoutPassword,
    });
  } catch (error) {
    // Передаємо помилку в глобальний обробник (app.js)
    next(error);
  }
};

// --- ВХІД (LOGIN) ---
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 1. Шукаємо користувача за username
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    // 2. Перевіряємо пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, "Invalid credentials");
    }

    // 3. Генеруємо нові токени
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    // 4. Видаляємо старі рефреш токени юзера і записуємо новий (Token Rotation)
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
      },
    });

    // 5. Встановлюємо Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 6. Повертаємо токен та дані без пароля
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      accessToken,
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) {
      throw createHttpError(401, "Refresh token missing");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      throw createHttpError(401, "Invalid or expired refresh token");
    }

    const dbToken = await prisma.refreshToken.findUnique({ where: { token } });
    if (!dbToken) {
      throw createHttpError(401, "Token not found in database");
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      throw createHttpError(401, "User not found");
    }

    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    await prisma.refreshToken.delete({ where: { token } });
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
      },
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (token) {
      await prisma.refreshToken.deleteMany({ where: { token } });
    }

    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};
