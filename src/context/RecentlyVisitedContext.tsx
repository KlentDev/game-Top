import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface RecentlyVisitedContextType {
  recentlyVisited: string[];
  addRecentlyVisited: (gameId: string) => void;
}

const RecentlyVisitedContext = createContext<RecentlyVisitedContextType | undefined>(undefined);

export function RecentlyVisitedProvider({ children }: { children: ReactNode }) {
  const [recentlyVisited, setRecentlyVisited] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentlyVisited');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('recentlyVisited', JSON.stringify(recentlyVisited));
  }, [recentlyVisited]);

  const addRecentlyVisited = (gameId: string) => {
    setRecentlyVisited(prev => {
      const filtered = prev.filter(id => id !== gameId);
      return [gameId, ...filtered].slice(0, 6);
    });
  };

  return (
    <RecentlyVisitedContext.Provider value={{ recentlyVisited, addRecentlyVisited }}>
      {children}
    </RecentlyVisitedContext.Provider>
  );
}

export function useRecentlyVisited() {
  const context = useContext(RecentlyVisitedContext);
  if (!context) throw new Error('useRecentlyVisited must be used within RecentlyVisitedProvider');
  return context;
}
