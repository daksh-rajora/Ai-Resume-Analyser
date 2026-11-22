const jwt = require("jsonwebtoken");
const env = require("../config/env");

function signToken(payload){
    return jwt.sign(payload, env.jwtSecret, {expiresIn: env.jwtExpiresIn})
}

function verifyToken(token){
    return jwt.verify(token, env.jwtSecret);
}

function getCookieOptions(req) {
    const isSecure =
        env.isProd ||
        Boolean(req?.secure) ||
        req?.headers?.["x-forwarded-proto"] === "https" ||
        (Boolean(req?.headers?.origin) && req.headers.origin.startsWith("https://"));

    return {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    };
}

const cookieOptions = {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
};

module.exports = { signToken, verifyToken, cookieOptions, getCookieOptions };