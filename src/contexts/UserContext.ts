import { createContext } from "react";
import { User } from "../types";

type UserContextArgs = {
  user: User | null,
  setUser: (user: User | null) => any
}

const args: UserContextArgs = {
  user: null,
  setUser: (user: User | null) => {}
}

export const UserContext = createContext(args);