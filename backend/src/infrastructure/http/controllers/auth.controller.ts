import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export class AuthController {
  public login = (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const identifier = email || username;

    if (!identifier || !password) {
      return res.status(400).json({ error: "Username/email and password are required." });
    }

    if (identifier === "admin@nuclic.ufc.br" && password === "admin") {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({
          error: "Internal Server Error. JWT secret configuration missing on server.",
        });
      }

      const token = jwt.sign({ username: identifier, role: "admin" }, jwtSecret, {
        expiresIn: "24h",
      });
      return res.status(200).json({ token });
    }

    return res.status(401).json({ error: "Invalid username or password." });
  };
}
