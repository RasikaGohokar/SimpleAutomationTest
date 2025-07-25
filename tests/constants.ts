export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export const SELECTORS = {
  username: "//*[@id='username']",
  password: "//*[@id='password']",
  loginButton: "//*[@id='root']/div/div/div/form/button",
  signupPageButton: "//*[@id='root']/div/div/div/div/button",
  signupButton: "//*[@id='root']/div/div/div/form/button",
  logoutButton: "#root > div > div > nav > div > div > button",
  todoInput: "//*[@id='root']/div/div/main/form/input",
  todoAddButton: "//*[@id='root']/div/div/main/form/button",
  todoEditButton: "//*[@id='root']/div/div/main/ul/li/div/button[1]",
  todoEditInput: "//*[@id='root']/div/div/main/ul/li/input",
  todoSaveButton: "//*[@id='root']/div/div/main/ul/li/div/button[1]",
  todoDeleteButton: "//*[@id='root']/div/div/main/ul/li/div/button[2]",
};

export const TEXTS = {
  signupSuccess: 'Signup successful!',
  loginSuccess: 'Login successful!',
  invalidCredentials: 'Invalid credentials',
  logoutSuccess: 'You have been logged out.',
  todoTitle: 'To-Do List',
  deletedMessage: 'Item deleted!',
};