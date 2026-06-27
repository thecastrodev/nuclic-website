import jwt from "jsonwebtoken";
export class AuthController {
    login = (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required." });
        }
        if (username === "admin" && password === "admin") {
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                return res.status(500).json({
                    error: "Internal Server Error. JWT secret configuration missing on server.",
                });
            }
            const token = jwt.sign({ username, role: "admin" }, jwtSecret, {
                expiresIn: "24h",
            });
            return res.status(200).json({ token });
        }
        return res.status(401).json({ error: "Invalid username or password." });
    };
}
