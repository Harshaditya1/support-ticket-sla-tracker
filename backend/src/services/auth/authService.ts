import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";


import {
  registerSchema,
  loginSchema,
  RegisterInput,
  LoginInput,
} from "../../validation/authValidation";
import { generateToken } from "../../utils/jwt";

const prisma = new PrismaClient();
export async function registerUser(input: RegisterInput) {
  const data = registerSchema.parse(input);

  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role as Role,
    },
  });

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user,
  };
}

export async function loginUser(input: LoginInput) {
  const data = loginSchema.parse(input);

  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user,
  };
}