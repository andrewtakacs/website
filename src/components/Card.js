import React from 'react';
import styles from './Card.module.css';

const Card = ({
  children,
  title,
  subtitle,
  className = '',
  elevated = false,
  hover = false,
  clickable = false,
  onClick,
  ...props
}) => {
  const cardClasses = [
    styles.card,
    elevated ? styles['card--elevated'] : '',
    hover ? styles['card--hover'] : '',
    clickable ? styles['card--clickable'] : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {(title || subtitle) && (
        <div className={styles.card__header}>
          {title && <h3 className={styles.card__title}>{title}</h3>}
          {subtitle && <p className={styles.card__subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={styles.card__body}>
        {children}
      </div>
    </div>
  );
};

export default Card;
