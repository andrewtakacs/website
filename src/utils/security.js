import React from 'react';
import { Helmet } from 'react-helmet-async';

export const SecurityHeaders = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Helmet>
  );
};

// CSRF Token generation with improved entropy
export const generateCSRFToken = () => {
  const array = new Uint32Array(8);
  crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
};

// Enhanced XSS Protection
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate name format
export const validateName = (name) => {
  const nameRegex = /^[A-Za-z\s-']{2,100}$/;
  return nameRegex.test(name);
}; 