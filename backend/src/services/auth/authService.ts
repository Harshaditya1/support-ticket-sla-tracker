import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";

import {
  registerSchema,
  RegisterInput,
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