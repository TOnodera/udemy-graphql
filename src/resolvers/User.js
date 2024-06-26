async function links(parent, args, context) {
  return await context.prisma.user
    .findUnique({
      where: { id: parent.id },
    })
    .links();
}

module.exports = {
  links,
};
