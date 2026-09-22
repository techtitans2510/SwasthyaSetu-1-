const DEMO_USERS = [
  {
    id: "PAT-001",
    name: "Patient",
    email: "patient@example.com",
    password: "patient123",
    role: "patient",
  },
  {
    id: "DOC-001",
    name: "Dr. Sharma",
    email: "doctor@example.com",
    password: "doctor123",
    role: "doctor",
  },
  {
    id: "ASHA-001",
    name: "Sunita Devi",
    email: "asha@example.com",
    password: "asha123",
    role: "asha",
  },
  {
    id: "NURSE-001",
    name: "Priya Sharma",
    email: "nurse@example.com",
    password: "nurse123",
    role: "nurse",
  },
  {
    id: "ANM-001",
    name: "Anita Kumari",
    email: "anm@example.com",
    password: "anm123",
    role: "anm",
  },
];

const USERS_STORAGE_KEY = "mock_users";

function getRegisteredUsers() {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);

  if (!storedUsers) {
    return [];
  }

  try {
    const users = JSON.parse(storedUsers);
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export async function loginUser(email, password) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const normalizedEmail = email.trim().toLowerCase();

  // Always check built-in demo accounts first.
  // These are independent of browser localStorage.
  const demoUser = DEMO_USERS.find(
    (user) =>
      user.email.toLowerCase() === normalizedEmail &&
      user.password === password
  );

  if (demoUser) {
    const { password: _password, ...safeUser } = demoUser;

    return {
      user: safeUser,
      token: `mock-token-${safeUser.id}`,
    };
  }

  // Registered users are browser-local for now.
  const registeredUsers = getRegisteredUsers();

  const user = registeredUsers.find(
    (item) =>
      item.email.toLowerCase() === normalizedEmail &&
      item.password === password
  );

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const { password: _password, ...safeUser } = user;

  return {
    user: safeUser,
    token: `mock-token-${safeUser.id}`,
  };
}

export async function registerUser(userData) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const email = userData.email.trim().toLowerCase();

  // Prevent registering with an existing demo account.
  const demoUser = DEMO_USERS.find(
    (user) => user.email.toLowerCase() === email
  );

  if (demoUser) {
    throw new Error("An account with this email already exists.");
  }

  const registeredUsers = getRegisteredUsers();

  const existingUser = registeredUsers.find(
    (user) => user.email.toLowerCase() === email
  );

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const newUser = {
    id: `PAT-${Date.now()}`,
    name: userData.name,
    email: userData.email.trim(),
    password: userData.password,
    role: "patient",
  };

  registeredUsers.push(newUser);
  saveRegisteredUsers(registeredUsers);

  const { password: _password, ...safeUser } = newUser;

  return {
    user: safeUser,
    token: `mock-token-${safeUser.id}`,
  };
}

export async function logoutUser() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return true;
}