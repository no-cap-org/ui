import { API } from "@/api";
import { User } from "@/pages/GroupView";
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

type ISessionContext = {
  user: User | null
  userId: string
  email: string
  sessionId: string
  isLoading: boolean
  clearSession: () => void
  setEmail: React.Dispatch<React.SetStateAction<string>>
  setUserId: React.Dispatch<React.SetStateAction<string>>
  setSessionId: React.Dispatch<React.SetStateAction<string>>
}

const defaultValues: ISessionContext = {
  user: null,
  userId: "",
  email: "",
  sessionId: "",
  isLoading: true,
  clearSession: () => {},
  setEmail: () => {},
  setUserId: () => {},
  setSessionId: () => {},
}

const SessionContext = createContext<ISessionContext>(defaultValues);

function SessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string>(""); 
  const [email, setEmail] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const clearSession = () => { 
    setUser(null);
    setUserId("");
    setEmail("");
    setSessionId("");
  };

  useEffect(() => {
    async function loadSessionInfo() {
      try {
        await API.METHODS.GET(
          `${API.ENDPOINTS.session.userSessionInfo}`,
          {},
          { withCredentials: true },
          {
            onSuccess: (data: any) => {
              setUserId(data.user._id);
              setUser({
                ...data.user,
                dob: new Date(data.user.dob),
                createdAt: new Date(data.user.createdAt),
                updatedAt: new Date(data.user.updatedAt),
              });
              setEmail(data.email);
              setSessionId(data.sessionId);
            },
            onError: () => {
              clearSession();
            },
          }
        );
      } catch (e) {
        console.error("Failed to load session:", e);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    }

    if (!sessionId) {
      loadSessionInfo();
    }
  }, []);

  return (
    <SessionContext.Provider
      value={{
        user,
        userId,
        email,
        sessionId,
        isLoading,
        clearSession,
        setEmail,
        setSessionId,
        setUserId,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

function useSession() {
  return useContext(SessionContext);
}

export { SessionProvider, useSession };

