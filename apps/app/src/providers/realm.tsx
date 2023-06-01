import * as RealmWeb from 'realm-web';

import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';

const RealmAppContext = React.createContext<{
  logIn: (email: string, password: string) => unknown;
  logOut: () => void;
  user: RealmWeb.User | null;
} | null>(null);

const RealmApp = ({ children }: { children: JSX.Element }) => {
  const app = new RealmWeb.App({ id: 'e-pressing-madeo' });
  const [user, setUser] = useState<RealmWeb.User | null>(null);

  const logIn = async (email: string, password: string) => {
    const credentials = RealmWeb.Credentials.emailPassword(email, password);
    try {
      await app.logIn(credentials);
      setUser(app.currentUser);
      return app.currentUser;
    } catch (e) {
      toast.error(e as unknown as string);
      setUser(null);
      return null;
    }
  };

  const logOut = () => {
    if (user !== null) {
      app.currentUser?.logOut();
      setUser(null);
    }
  };

  return (
    <RealmAppContext.Provider
      value={{
        logIn,
        logOut,
        user,
      }}
    >
      {children}
    </RealmAppContext.Provider>
  );
};

export const useRealmApp = () => {
  const realmContext = useContext(RealmAppContext);
  if (realmContext == null) {
    throw new Error('useRealmApp() called outside of a RealmApp?');
  }
  return realmContext;
};

export default RealmApp;
