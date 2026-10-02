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
    return null; // App opens on Login Page by default
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

  const loginWithCredentials = (identifier, passwordOrDob, role) => {
    const rawId = (identifier || '').trim();
    const cleanDigits = rawId.replace(/\D/g, '');
    const cleanEmail = rawId.toLowerCase();

    // Find in seed users and dynamic rosters
    const user = INITIAL_USERS.find(u => {
      const uPhoneDigits = (u.phone || '').replace(/\D/g, '');
      const phoneMatch = cleanDigits.length >= 4 && uPhoneDigits.length >= 4 && (uPhoneDigits === cleanDigits || uPhoneDigits.endsWith(cleanDigits) || cleanDigits.endsWith(uPhoneDigits));
      const emailMatch = u.email && u.email.toLowerCase() === cleanEmail;
      const roleMatch = !role || u.role === role;
      return (phoneMatch || emailMatch) && roleMatch;
    });

    if (user) {
      const rawInput = (passwordOrDob || '').trim();
      const inputPass = rawInput.replace(/[\s\-\/]/g, '');
      const userDobClean = (user.dob || '').replace(/[\s\-\/]/g, '');
      let dobDDMMYYYY = '';
      if (user.dob && user.dob.includes('-')) {
        const parts = user.dob.split('-');
        if (parts.length === 3) {
          dobDDMMYYYY = `${parts[2]}${parts[1]}${parts[0]}`; // DDMMYYYY
        }
      }

      const passMatches =
        !rawInput ||
        rawInput === 'password123' ||
        rawInput === 'Admin@123' ||
        rawInput === 'Teacher@123' ||
        rawInput === 'Student@123' ||
        rawInput === 'Parent@123' ||
        inputPass === userDobClean ||
        inputPass === dobDDMMYYYY ||
        rawInput === user.dob;

      if (passMatches) {
        setCurrentUser(user);
        return { success: true, user };
      } else {
        return {
          success: false,
          error: `Incorrect Date of Birth / Password. (Demo DOB is ${user.dob || 'YYYY-MM-DD'})`,
        };
      }
    }

    if (role) {
      const fallback = INITIAL_USERS.find(u => u.role === role);
      if (fallback) {
        setCurrentUser(fallback);
        return { success: true, user: fallback };
      }
    }

    return { success: false, error: 'No account found with this Phone number or Email for the selected role.' };
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
    if (currentUser.role === ROLES.ADMIN) return true; // Administrator has universal access
    if (tabId === 'teachers' || tabId === 'faculty') {
      return permissions.allowedTabs.includes('teachers') || permissions.allowedTabs.includes('faculty');
    }
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
