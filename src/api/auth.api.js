const DEFAULT_USERS = [
  {
    id: "PAT-001",
    name: "Patient",
    email: "patient@example.com",
    password: "patient123",
    role: "patient"
  },
  {
    id: "DOC-001",
    name: "Dr. Sharma",
    email: "doctor@example.com",
    password: "doctor123",
    role: "doctor"
  },
  {
    id: "ASHA-001",
    name: "Sunita Devi",
    email: "asha@example.com",
    password: "asha123",
    role: "asha"
  },
  {
    id: "NURSE-001",
    name: "Priya Sharma",
    email: "nurse@example.com",
    password: "nurse123",
    role: "nurse"
  },
  {
    id: "ANM-001",
    name: "Anita Kumari",
    email: "anm@example.com",
    password: "anm123",
    role: "anm"
  }
];

const USERS_STORAGE_KEY = "mock_users";

function getUsers() {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);

  if (!storedUsers) {
    localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify(DEFAULT_USERS)
    );

    return DEFAULT_USERS;
  }

  try {
    return JSON.parse(storedUsers);
  } catch {
    localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify(DEFAULT_USERS)
    );

    return DEFAULT_USERS;
  }
}

function saveUsers(users) {
  localStorage.setItem(
    USERS_STORAGE_KEY,
    JSON.stringify(users)
  );
}

/*
 * Mock Login
 * Later:
 * POST /api/auth/login
 */
export async function loginUser(email, password) {
  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

  const users = getUsers();

  const user = users.find(
    (item) =>
      item.email.toLowerCase() === email.toLowerCase() &&
      item.password === password
  );

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const {
    password: _password,
    ...safeUser
  } = user;

  return {
    user: safeUser,
    token: `mock-token-${safeUser.id}`
  };
}

/*
 * Mock Registration
 * Later:
 * POST /api/auth/register
 */
export async function registerUser(userData) {
  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

  const users = getUsers();

  const existingUser = users.find(
    (user) =>
      user.email.toLowerCase() ===
      userData.email.toLowerCase()
  );

  if (existingUser) {
    throw new Error(
      "An account with this email already exists."
    );
  }

  const newUser = {
    id: `PAT-${Date.now()}`,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: "patient"
  };

  users.push(newUser);

  saveUsers(users);

  const {
    password: _password,
    ...safeUser
  } = newUser;

  return {
    user: safeUser,
    token: `mock-token-${safeUser.id}`
  };
}

/*
 * Mock Logout
 * Later this may invalidate a backend session/refresh token.
 */
export async function logoutUser() {
  await new Promise((resolve) => {
    setTimeout(resolve, 200);
  });

  return true;
}