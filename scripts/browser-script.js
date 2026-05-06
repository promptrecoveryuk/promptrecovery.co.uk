// Run on the Google Maps reviews page, or inject from scripts/scrape-google-reviews.mjs.
(function (global) {
  function getTopLevelReviewContainers(root) {
    return [...root.querySelectorAll('div[data-review-id]')].filter(
      (el) => !el.parentElement?.closest('[data-review-id]')
    );
  }

  function getText(el, selector) {
    return el.querySelector(selector)?.textContent?.trim() ?? null;
  }

  function getDatasetValue(el, selector, key) {
    return el.querySelector(selector)?.dataset?.[key] ?? null;
  }

  function getImageSource(el, selector) {
    return el.querySelector(selector)?.src ?? null;
  }

  function getRating(el) {
    const stars = el
      .querySelector('[role="img"][aria-label*="star"], [aria-label*="stars"], [aria-label*="star"]')
      ?.getAttribute('aria-label');

    return stars ? parseInt(stars, 10) : null;
  }

  function normaliseReview(review) {
    return {
      ...review,
      author: review.author ?? 'Google user',
      authorDetails: review.authorDetails ?? '',
      authorPhoto: review.authorPhoto ?? '',
      authorUrl: review.authorUrl ?? '',
      rating: review.rating ?? 0,
      when: review.when ?? '',
      publishTime: review.publishTime ?? '',
      text: review.text ?? '',
    };
  }

  function extractGoogleReviews(root = document) {
    const seen = new Set();

    return getTopLevelReviewContainers(root)
      .map((el) => {
        const when = getText(el, '.rsqaWe');

        return normaliseReview({
          reviewId: el.dataset.reviewId ?? null,
          author: getText(el, '.d4r55'),
          authorDetails: getText(el, '.RfnDt'),
          authorPhoto: getImageSource(el, '.NBa7we'),
          authorUrl: getDatasetValue(el, '[data-href]', 'href'),
          rating: getRating(el),
          when,
          publishTime: when,
          // span.wiI7pd = review text; div.wiI7pd = owner response, so target the review text only.
          text: getText(el, 'span.wiI7pd'),
        });
      })
      .filter((review) => {
        if (!review.reviewId || seen.has(review.reviewId)) {
          return false;
        }

        seen.add(review.reviewId);
        return true;
      });
  }

  function downloadGoogleReviews(filename = 'google-reviews.json') {
    const reviews = extractGoogleReviews();

    console.log(`Found ${reviews.length} reviews`);
    console.table(reviews);

    const blob = new Blob([JSON.stringify(reviews, null, 2)], { type: 'application/json' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: filename,
    });

    a.click();
    URL.revokeObjectURL(a.href);

    return reviews;
  }

  global.extractGoogleReviews = extractGoogleReviews;
  global.downloadGoogleReviews = downloadGoogleReviews;

  if (global.__PROMPT_RECOVERY_GOOGLE_REVIEWS_AUTORUN__ !== false) {
    downloadGoogleReviews();
  }
})(window);
