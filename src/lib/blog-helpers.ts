import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.locale('ja');
dayjs.extend(utc);

// 日付データを変換
const formatDateTime = (date: string) => {
  return dayjs
    .utc(date)
    .local()
    .format('YYYY-MM-DD');
};

export const getBlogLink = (slug: string) => {
  return `/blog/${slug}`;
};

export const getDateStr = date => {
  return formatDateTime(date);
};

export const postIsPublished = (post: any) => {
  return post.Published === 'Yes';
};

export const normalizeSlug = slug => {
  if (typeof slug !== 'string') return slug;

  let startingSlash = slug.startsWith('/');
  let endingSlash = slug.endsWith('/');

  if (startingSlash) {
    slug = slug.substr(1);
  }
  if (endingSlash) {
    slug = slug.substr(0, slug.length - 1);
  }
  return startingSlash || endingSlash ? normalizeSlug(slug) : slug;
};
