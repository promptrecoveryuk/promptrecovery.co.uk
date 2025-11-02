'use client';

import styles from './star-rating.module.css';

function StarRating({ rating, outOf = 5 }) {
  const percentage = (Math.max(0, Math.min(rating, outOf)) / outOf) * 100;

  return (
    <div className={styles['star-rating']} aria-label={`Rating: ${rating} out of ${outOf}`}>
      <div className={styles['star-rating-back']}>
        {[...Array(outOf)].map((_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="lightgray"
            width="24"
            height="24"
          >
            <path d="M12 .587l3.668 7.431L24 9.748l-6 5.847L19.335 24 12 20.201 4.665 24l1.335-8.405L0 9.748l8.332-1.73L12 .587z" />
          </svg>
        ))}
      </div>
      <div className={styles['star-rating-front']} style={{ width: `${percentage}%` }}>
        {[...Array(outOf)].map((_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="gold"
            width="24"
            height="24"
          >
            <path d="M12 .587l3.668 7.431L24 9.748l-6 5.847L19.335 24 12 20.201 4.665 24l1.335-8.405L0 9.748l8.332-1.73L12 .587z" />
          </svg>
        ))}
      </div>
      </div>
  );
}

export default StarRating;