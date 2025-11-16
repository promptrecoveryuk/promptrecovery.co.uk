import fs from 'node:fs/promises';
import path from 'node:path';

const placeId = process.env.GOOGLE_PLACE_ID;
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

if (!placeId || !apiKey) {
  console.error('Missing GOOGLE_PLACE_ID or GOOGLE_MAPS_API_KEY');
  process.exit(1);
}

const endpoint = `https://places.googleapis.com/v1/places/${placeId}`;
const headers = {
  'X-Goog-Api-Key': apiKey,
  'X-Goog-FieldMask': [
    'displayName',
    'rating',
    'userRatingCount',
    'reviews.rating',
    'reviews.text',
    'reviews.publishTime',
    'reviews.relativePublishTimeDescription',
    'reviews.authorAttribution.displayName',
    'reviews.authorAttribution.uri',
    'reviews.authorAttribution.photoUri',
    'googleMapsUri',
    'googleMapsLinks.reviewsUri'
  ].join(',')
};

async function main() {
  const res = await fetch(`${endpoint}?languageCode=en-GB&regionCode=GB`, { headers });

  if (!res.ok) {
    const text = await res.text();
    console.error('Places API error:', res.status, text);
    process.exit(1);
  }

  const data = await res.json();

  const allReviews = Array.isArray(data.reviews) ? data.reviews : [];

  // e.g. filter to 4★+ and take top 5 – tweak as you like
  const selected = allReviews
    .filter(r => r.rating >= 4)
    .slice(0, 5)
    .map(r => ({
      rating: r.rating,
      text: r.text?.text ?? r.text ?? '',
      publishTime: r.publishTime,
      when: r.relativePublishTimeDescription ?? r.publishTime ?? '',
      author: r.authorAttribution?.displayName ?? 'Google user',
      authorUrl: r.authorAttribution?.uri ?? null,
      authorPhoto: r.authorAttribution?.photoUri ?? null
    }));

  const output = {
    displayName: data.displayName?.text ?? data.displayName ?? '',
    rating: data.rating ?? null,
    userRatingCount: data.userRatingCount ?? 0,
    reviewsUrl: data.googleMapsLinks?.reviewsUri ?? data.googleMapsUri ?? null,
    reviews: selected
  };

  const outDir = path.join(process.cwd(), 'app/data');
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(
    path.join(outDir, 'google-reviews.json'),
    JSON.stringify(output, null, 2),
    'utf8'
  );

  console.log(`Wrote ${selected.length} reviews, plus overall count of ${data.userRatingCount} and rating of ${output.rating} to app/data/google-reviews.json`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});