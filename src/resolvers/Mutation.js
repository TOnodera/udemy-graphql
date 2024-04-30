const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../utils");

/**
 * ユーザー登録
 * @param {*} parent
 * @param {*} args
 * @param {*} context
 * @returns
 */
async function signup(parent, args, context) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password,
    },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return { token, user };
}

async function login(parent, args, context) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("そのようなユーザーは存在しません");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("無効なパスワードです");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return { token, user };
}

async function post(parent, args, context) {
  const { userId } = context;
  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
  // 送信
  context.pubsub.publish("NEW_LINK", newLink);
  return newLink;
}

module.exports = {
  signup,
  login,
  post,
};
