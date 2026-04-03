export type GoogleReviews = {
  /**
   * The name of the business the reviews are for
   */
  displayName: string;
  /**
   * The overall rating for the business with a 0.1 precision, from 0.0-5.0
   */
  rating: number;
  /**
   * The total number of ratings for the business
   */
  userRatingCount: number;
  /**
   * The url of the reviews homepage for the business
   */
  reviewsUrl: string;
  /**
   * The reviews
   */
  reviews: Array<GoogleReview>;
};

export type GoogleReview = {
  /**
   * The user's rating, from 1-5
   */
  rating: number;
  /**
   * The rating itself
   */
  text: string;
  /**
   * The date when the review was published
   */
  publishTime: string;
  /**
   * Relative date of publishing in the format "x days/weeks/months/years ago"
   */
  when: string;
  /**
   * The name of the author
   */
  author: string;
  /**
   * The url to the author's Google public profile page
   */
  authorUrl: string;
  /**
   * The url to the author's Google profile photo
   */
  authorPhoto: string;
};

export type GoogleUser = {
  /**
   * The name of the author
   */
  author: string;
  /**
   * The url to the author's Google public profile page
   */
  authorUrl: string;
  /**
   * The url to the author's Google profile photo
   */
  authorPhoto: string;
};

export type Faq = {
  /**
   * The frequently asked question
   */
  question: string;
  /**
   * The answer
   */
  answer: string;
};

export type ItemWithIcon = {
  name: string;
  description: string;
  icon: string;
};

export type ItemWithIconAndPicture = {
  name: string;
  id?: string;
  description: string;
  icon: string;
  picture: Picture;
};

export type Picture = {
  filePath: string;
  filePath1: string;
  filePath2: string;
  description: string;
  width: number;
  height: number;
  width1: number;
  height1: number;
  width2: number;
  height2: number;
};

export type PictureImage = {
  url: string;
  description: string;
  width: number;
  height: number;
};

export interface BaseContentMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  imageIndex: number;
  author: string;
}

export interface PostMeta extends BaseContentMeta {
  /** Optional ordered step names — used to generate HowTo structured data. */
  steps?: string[];
}

export interface AreaMeta extends BaseContentMeta {
  /** Optional FAQs — used to generate FAQPage structured data. */
  faqs?: Faq[];
}

export type MdxContent<TMeta extends BaseContentMeta> = {
  meta: TMeta;
  content: string;
};

export type BreadcrumbItem = {
  name: string;
  item?: string;
};
