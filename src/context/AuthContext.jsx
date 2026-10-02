import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, INITIAL_USERS, ROLE_PERMISSIONS } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('edusphere_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    // Default to Student or Admin for first launch
    return INITIAL_USERS.find(u => u.role === ROLES.ADMIN);
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('edusphere_theme') || 'light';
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('edusphere_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('edusphere_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('edusphere_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const loginWithRole = (role) => {
    const user = INITIAL_USERS.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const loginWithCredentials = (email, password, role) => {
    const user = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && (!role || user.role === role)) {
      setCurrentUser(user);
      return { success: true, user };
    }
    // If not found in seed, check if role was selected and provide demo login
    if (role) {
      const fallback = INITIAL_USERS.find(u => u.role === role);
      setCurrentUser(fallback);
      return { success: true, user: fallback };
    }
    return { success: false, error: 'Invalid email or password. Try quick login buttons.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const hasPermission = (tabId) => {
    if (!currentUser) return false;
    const permissions = ROLE_PERMISSIONS[currentUser.role];
    if (!permissions) return false;
    return permissions.allowedTabs.includes(tabId);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        theme,
        toggleTheme,
        loginWithRole,
        loginWithCredentials,
        logout,
        hasPermission,
        roleConfig: currentUser ? ROLE_PERMISSIONS[currentUser.role] : null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
