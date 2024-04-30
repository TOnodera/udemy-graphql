const jwt = require("jsonwebtoken");

// トークンを複合する
function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

// ユーザーIDを取得
function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        throw new Error("トークンが見つかりませんでした");
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("認証権限がありません");
}

const APP_SECRET = "GRAPHQL";

module.exports = {
  APP_SECRET,
  getUserId,
};
