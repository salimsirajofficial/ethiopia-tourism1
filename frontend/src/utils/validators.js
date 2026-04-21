export const validateEmail = (email) => {
  if (!email) return "Email is required";
  const value = email.trim().toLowerCase();
  const re = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!re.test(value)) return "Please enter a valid email address";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must include at least one number";
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) return "Password must include at least one special character";
  return "";
};

export const validateName = (name) => {
  if (!name) return "Full name is required";
  const value = name.trim();
  if (value.length < 2) return "Full name must be at least 2 characters";
  if (!/^[a-zA-Z\s]+$/.test(value)) return "Name should only contain letters and spaces";
  return "";
};

export const validateUsername = (username) => {
  if (!username) return "Username is required";
  const value = username.trim();
  if (value.length < 3) return "Username must be at least 3 characters";
  if (value.length > 20) return "Username must not exceed 20 characters";
  if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Username can only contain letters, numbers, and underscores";
  return "";
};

