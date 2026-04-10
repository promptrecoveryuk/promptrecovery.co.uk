import { staticGoogleReviews } from '../app/data/index';

export function getGoogleReviewById(reviewId: string) {
  return staticGoogleReviews.find((review) => review.reviewId === reviewId);
}
