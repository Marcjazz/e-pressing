import React, { useContext, useEffect, useState } from 'react';

import { useRealmApp } from './realm';

const MongoDBContext = React.createContext<{
  db: Realm.Services.MongoDBDatabase | null;
}>({ db: null });

const MongoDB = ({ children }: { children: JSX.Element }) => {
  const { user } = useRealmApp();
  const [db, setDb] = useState<Realm.Services.MongoDBDatabase | null>(null);

  useEffect(() => {
    if (user !== null) {
      const realmService = user.mongoClient('mongodb-atlas');
      setDb(realmService.db('epressing_db'));
    }
  }, [user]);

  return (
    <MongoDBContext.Provider
      value={{
        db,
      }}
    >
      {children}
    </MongoDBContext.Provider>
  );
};

export const useMongoDB = () => {
  const mdbContext = useContext(MongoDBContext);
  if (mdbContext === null) {
    throw new Error('useMongoDB() called outside of a MongoDB?');
  }
  return mdbContext;
};

export default MongoDB;
