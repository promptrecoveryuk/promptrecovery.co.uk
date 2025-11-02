import { NextResponse } from 'next/server';

export async function GET() {
  const placeId = process.env.GOOGLE_PLACE_ID;           // e.g. "ChIJN1t_tDeuEmsRUsoyG83frY4"
  const apiKey  = process.env.GOOGLE_MAPS_API_KEY;
  const url     = `https://places.googleapis.com/v1/places/${placeId}`;

  // const res = await fetch(`${url}?languageCode=en_GB&regionCode=GB`, {
  //   headers: {
  //     'X-Goog-Api-Key': apiKey,
  //     // Ask only for what you need (controls cost)
  //     'X-Goog-FieldMask': [
  //       'displayName','rating','userRatingCount',
  //       // reviews are capped to 5 by Google
  //       'reviews.rating','reviews.text','reviews.publishTime',
  //       'reviews.relativePublishTimeDescription',
  //       'reviews.authorAttribution.displayName',
  //       'reviews.authorAttribution.uri',
  //       'reviews.authorAttribution.photoUri',
  //       'googleMapsUri','googleMapsLinks.reviewsUri'
  //     ].join(',')
  //   },
  //   // cache on the server and auto-refresh hourly
  //   next: { revalidate: 3600 }
  // });

  // if (!res.ok) return NextResponse.json({ error: 'Places API error' }, { status: 500 });
  // const data = await res.json();

  // Mocked data for local development without incurring API costs
  const data = {
    "displayName": "Prompt Recovery",
    "rating": 5,
    "userRatingCount": 39,
    "reviews": [
      {
        "rating": 5,
        "text": { "text": "I can’t recommend Prompt Recovery enough! I was thoroughly impressed by the level of professionalism and efficiency they provided. The driver arrived quickly, was professional and friendly, and clearly knew exactly what he was doing. It’s clear that they take great pride in their work and genuinely care about their customers. I wouldn’t hesitate to call them again or recommend them to anyone in need of roadside assistance!" },
        "relativePublishTimeDescription": "a week ago",
        "authorAttribution": {
          "displayName": "N& D",
          "uri": "https://www.google.com/maps/contrib/109891763094515548838/reviews/@51.2384459,-0.5904145,9z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=en&entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D",
          "photoUri": "https://lh3.googleusercontent.com/a/ACg8ocLTZyUAOVse1KIpcQybgLJMkqjdd4pk3pGVdGPAEipV77X2bQ=w72-h72-p-rp-mo-br100"
        }
      },
      {
        "rating": 5,
        "text": { "text": "I arranged with Nick to recover a car for me, his communication was excellent and extremely punctual at the location, messaging me the night before to reassure me, his service was excellent and very polite. I would highly recommend him. Superb from start to finish. 👍👍👍👍" },
        "relativePublishTimeDescription": "2 weeks ago",
        "authorAttribution": {
          "displayName": "Reza Vaziri",
          "uri": "https://www.google.com/maps/contrib/109962443865133553018/reviews/@52.204628,-0.9080557,9z/data=!3m1!4b1!4m3!8m2!3m1!1e1?hl=en&entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D",
          "photoUri": "https://lh3.googleusercontent.com/a/ACg8ocIyHH9KjgbmhGOIr36iH4hSzk9aYgcqy7Sss9ps1NndhnFegg=w144-h144-p-rp-mo-br100"
        }
      }
    ],
    "googleMapsUri": "https://www.google.com/maps/place/Prompt+Recovery/@51.68032,-0.3993182,17z/data=!4m16!1m9!3m8!1s0xa470618e0a0b3b7f:0xc97900f577ce9f7c!2sPrompt+Recovery!8m2!3d51.68032!4d-0.3967379!9m1!1b1!16s%2Fg%2F11xgsxw_k3!3m5!1s0xa470618e0a0b3b7f:0xc97900f577ce9f7c!8m2!3d51.68032!4d-0.3967379!16s%2Fg%2F11xgsxw_k3?entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D",
    "googleMapsLinks": {
      "reviewsUri": "https://www.google.com/maps/place/Prompt+Recovery/@51.68032,-0.3993182,17z/data=!4m8!3m7!1s0xa470618e0a0b3b7f:0xc97900f577ce9f7c!8m2!3d51.68032!4d-0.3967379!9m1!1b1!16s%2Fg%2F11xgsxw_k3?entry=ttu&g_ep=EgoyMDI1MTAyOS4yIKXMDSoASAFQAw%3D%3D"
    }
  };

  return NextResponse.json({
    name: data.displayName?.text ?? data.displayName,
    rating: data.rating,
    count: data.userRatingCount,
    reviews: (data.reviews ?? []).map((review) => ({
      rating: review.rating,
      text: review.text?.text ?? review.text,
      when: review.relativePublishTimeDescription ?? review.publishTime,
      author: review.authorAttribution?.displayName,
      authorUrl: review.authorAttribution?.uri,
      authorPhoto: review.authorAttribution?.photoUri
    })),
    // Handy deep link to "Read all reviews on Google"
    reviewsUrl: data.googleMapsLinks?.reviewsUri ?? data.googleMapsUri
  });
}