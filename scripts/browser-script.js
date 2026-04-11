// Run on https://www.google.com/maps/place/Prompt+Recovery/@51.68032,-0.3967379,17z/data=!3m1!4b1!4m8!3m7!1s0xa470618e0a0b3b7f:0xc97900f577ce9f7c!8m2!3d51.68032!4d-0.3967379!9m1!1b1!16s%2Fg%2F11xgsxw_k3?entry=ttu&g_ep=EgoyMDI2MDQwNy4wIKXMDSoASAFQAw%3D%3D
(function () {
  // Top-level review containers (exclude nested duplicates)
  const containers = [...document.querySelectorAll('div[data-review-id]')]
    .filter(el => !el.parentElement.closest('[data-review-id]'));

  const reviews = containers.map(el => {
    const stars = el.querySelector('[aria-label*="stars"]')?.getAttribute('aria-label');
    const rating = stars ? parseInt(stars) : null;

    return {
      reviewId: el.dataset.reviewId,
      author: el.querySelector('.d4r55')?.textContent.trim() ?? null,
      authorDetails: el.querySelector('.RfnDt')?.textContent.trim() ?? null,
      authorPhoto: el.querySelector('.NBa7we')?.src ?? null,
      authorUrl: el.querySelector('[data-href]')?.dataset.href ?? null,
      rating,
      when: el.querySelector('.rsqaWe')?.textContent.trim() ?? null,
      publishTime: el.querySelector('.rsqaWe')?.textContent.trim() ?? null,
      // span.wiI7pd = review text; div.wiI7pd = owner response — this targets review only
      text: el.querySelector('span.wiI7pd')?.textContent.trim() ?? null,
    };
  });

  console.log(`Found ${reviews.length} reviews`);
  console.table(reviews);

  // Trigger download
  const blob = new Blob([JSON.stringify(reviews, null, 2)], { type: 'application/json' });
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: 'google-reviews.json',
  });
  a.click();
  URL.revokeObjectURL(a.href);
})();
