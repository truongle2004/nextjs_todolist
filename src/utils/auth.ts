export const isLoggedIn = () => {
  return localStorage.getItem('user_id') !== null;
};

export const logout = () => {
  localStorage.removeItem('user_id');
  window.location.href = '/';
};

export const getUserId = () => {
  return Number(localStorage.getItem('user_id'));
};
