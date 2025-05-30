import jwt from 'jsonwebtoken';
import process from 'process';

export const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: "Authentication required. Please provide a token." });
        }

        // Remove 'Bearer ' prefix if it exists
        const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;

        jwt.verify(tokenValue, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: "Token expired or invalid." });

            req.user = user;
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}