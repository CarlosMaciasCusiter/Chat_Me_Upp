const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { Op } = require("Sequelize");
const { PubSub } = require("graphql-subscriptions");
const pubSub = new PubSub();
const { Message, User } = require("../../models");

module.exports = {
  Query: {
    getMessages: async (parent, { from }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        const otherUser = await User.findOne({
          where: { username: from },
        });
        if (!otherUser) throw new UserInputError("User not found");
        const usernames = [user.username, otherUser.username];
        const messages = await Message.findAll({
          where: {
            from: { [Op.in]: usernames },
            to: { [Op.in]: usernames },
          },
          order: [["createdAt", "DESC"]],
        });
        return messages;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Mutation: {
    sendMessage: async (parent, { to, content }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        const recipient = await User.findOne({ where: { username: to } });
        if (!recipient) {
          throw new UserInputError("user not found");
        } else if (recipient.username === user.username) {
          throw new UserInputError("Cant message self");
        }
        if (content.trim() === "") {
          throw new UserInputError("Message is empty");
        }
        const message = await Message.create({
          from: user.username,
          to,
          content,
        });

        pubSub.publish("NEW_MESSAGE", { newMessage: message });

        return message;
      } catch (errors) {
        console.log(errors);
        throw errors;
      }
    },
  },
  Subscription: {
    newMessage: { subscribe: () => pubSub.asyncInterator(["NEW_MESSAGE"]) },
  },
};
