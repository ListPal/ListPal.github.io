import jwt from "jsonwebtoken"
import Cookies from "js-cookie"

// const JWT_SECRET = 'your-secret-key'; // Replace with your actual JWT secret key
// const TOKEN_EXPIRATION = '1h'; // Token expiration time (example: 1 hour)

export const setJwtInCookie = (token) => {
  Cookies.set("jwt", token, {
    secure: true,
    sameSite: "strict",
    httpOnly: true,
  })
}

export const getJwtFromCookie = () => {
  return Cookies.get("jwt")
}


// export function generateToken(payload) {
//   return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
// }

// export function validateToken(token) {
//   try {
//     return jwt.verify(token, JWT_SECRET);
//   } catch (error) {
//     return null; // Invalid token
//   }
// }

// export function decodeToken(token) {
//   return jwt.decode(token);
// }
