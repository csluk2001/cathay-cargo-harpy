import { create } from "zustand";

interface Credential {
  galaxyId: string;
  email: string;
  password: string;
}

interface CredentialsData {
  admin: Credential[];
  user: Credential;
}

interface LoginCredentialState {
  loginCredential: Credential | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loadCredentials: () => Promise<CredentialsData>;
}

export const useLoginCredentials = create<LoginCredentialState>((set, get) => ({
  loginCredential: null,
  isLoggedIn: false,
  login: async (email, password) => {
    const credentials = await get().loadCredentials();

    // Check both admin array and single user
    const isValidAdmin = credentials.admin.some(
      (cred) => cred.email === email && cred.password === password,
    );
    const isValidUser =
      credentials.user.email === email &&
      credentials.user.password === password;

    const isValid = isValidAdmin || isValidUser;

    set({
      isLoggedIn: isValid,
      loginCredential: isValid
        ? isValidAdmin
          ? credentials.admin.find(
              (cred) => cred.email === email && cred.password === password,
            )
          : credentials.user
        : null,
    });
    return isValid;
  },
  loadCredentials: async () => {
    const res = await fetch("/assets/credentials/login_credentials.json");
    const data: CredentialsData = await res.json();
    return data;
  },
}));
