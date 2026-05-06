import { staticGoogleReviews } from '../app/data/index';

export function getGoogleReviewById(reviewId: string) {
  return staticGoogleReviews.find((review) => review.reviewId === reviewId);
}

export function getGoogleReviewsByIds(reviewIds: string[]) {
  return staticGoogleReviews.filter((review) => reviewIds.includes(review.reviewId));
}
