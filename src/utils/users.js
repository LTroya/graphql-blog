export const getFirstName = (name) => {
  return name.split(' ')[0];
};

export const isValidPassword = (password) => {
    return password.length >= 8 && !password.toLowerCase().includes('password');
};