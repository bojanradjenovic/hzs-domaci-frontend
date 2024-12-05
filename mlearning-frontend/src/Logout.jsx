import React, { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.cookie = "token=; path=/; SameSite=Lax;";
    navigate('/login');

  }, [navigate]);
};

export default Logout;
