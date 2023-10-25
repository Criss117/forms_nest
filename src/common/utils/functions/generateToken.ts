export const generateToken = () => {
  const randomPart = Math.random().toString(32).substring(2);
  const timestampPart = Date.now().toString(32);
  const token = randomPart + timestampPart;

  if (token.length > 19) {
    return token.substring(0, 19);
  }

  return token;
};
