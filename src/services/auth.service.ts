import prisma from "../config/prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { Role } from "@prisma/client";
import { logger } from "../utils/logger.js";
import { BadRequestError } from "../errors/BadRequestError.js";

interface RegisterUserInput {
  email: string;
  password: string;
  role: Role;
  firstName: string;
  lastName: string;
}

export async function registerUser(data: RegisterUserInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role: data.role,

      profile: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
      },
    },

    include: {
      profile: true,
    },
  });

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "REGISTER",
      entity: "User",
      entityId: user.id,
    },
  });
  // Remove password before sending response
  const { password, ...safeUser } = user;

  return {
    token,
    user: safeUser,
  };
}

interface LoginInput {
  email: string;
  password: string;
}

export async function loginUser(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  const isMatch = await comparePassword(data.password, user.password);

  if (!isMatch) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  logger.info({
    userId: user.id,
    action: "LOGIN_SUCCESS",
  });
  // Remove password before sending response
  const { password, ...safeUser } = user;

  return {
    token,
    user: safeUser,
  };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const { password, ...safeUser } = user;

  return safeUser;
}
