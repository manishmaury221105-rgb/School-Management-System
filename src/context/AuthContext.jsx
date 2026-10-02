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

  const loginWithCredentials = (identifier, password, role) => {
    const cleanId = identifier.trim().toLowerCase();
    const user = INITIAL_USERS.find(
      u => u.email.toLowerCase() === cleanId || (u.phone && u.phone.includes(cleanId))
    );

    if (user && (!role || user.role === role)) {
      setCurrentUser(user);
      return { success: true, user };
    }
    if (role) {
      const fallback = INITIAL_USERS.find(u => u.role === role);
      setCurrentUser(fallback);
      return { success: true, user: fallback };
    }
    return { success: false, error: 'Invalid email, mobile or password.' };
  };

  const registerUser = (userData) => {
    const id = `user-${Date.now()}`;
    const newUser = {
      id,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      ...userData,
    };
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const forgotPassword = (email) => {
    return { success: true, message: `Password reset verification link sent to ${email}` };
  };

  const resetPassword = (email, newPassword) => {
    return { success: true, message: 'Password has been successfully updated.' };
  };

  const changePassword = (currentPassword, newPassword) => {
    return { success: true, message: 'Security password changed successfully.' };
  };

  const updateProfile = (updatedData) => {
    setCurrentUser(prev => ({ ...prev, ...updatedData }));
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
        registerUser,
        forgotPassword,
        resetPassword,
        changePassword,
        updateProfile,
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
