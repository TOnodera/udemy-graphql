function newLinkSubscribe(parent, args, context) {
  return context.pubsub.asyncIterator("NEW_LINK");
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => payload,
};

function newVoteSubscribe(parent, args, context) {
  return context.pubsub.asyncIterator("NEW_VOTE");
}

const newVote = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => payload,
};

module.exports = { newLink, newVote };
