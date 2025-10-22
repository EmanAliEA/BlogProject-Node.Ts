// check ownership
const checkOwnership = (blog: any, userId: string) => {
  return blog.user_id?.toString() !== userId;
};

export { checkOwnership };
