import type { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { name, nik, email, password } = req.body

  if (!name || !nik || !password) {
    return res.status(400).json({ message: "Data wajib diisi" })
  }

  const exist = await prisma.user.findFirst({
    where: { OR: [{ nik }, { email }] },
  })

  if (exist) {
    return res.status(409).json({ message: "User sudah terdaftar" })
  }

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      nik,
      email,
      password: hashed,
    },
  })

  return res.status(201).json({ id: user.id })
}
