import React from 'react';
import styles from './Button.module.css';

const Button = ({
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    variant !== 'default' ? styles[`button--${variant}`] : '',
    size !== 'md' ? styles[`button--${size}`] : '',
    disabled ? styles.button__disabled : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;