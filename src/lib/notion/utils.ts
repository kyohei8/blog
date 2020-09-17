import { NextApiRequest, NextApiResponse } from 'next';

export function setHeaders(req: NextApiRequest, res: NextApiResponse): boolean {
  // set SPR/CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'pragma');

  if (req.method === 'OPTIONS') {
    res.status(200);
    res.end();
    return true;
  }
  return false;
}

export async function handleData(res: NextApiResponse, data: any) {
  data = data || { status: 'error', message: 'unhandled request' };
  res.status(data.status !== 'error' ? 200 : 500);
  res.json(data);
}

export function handleError(res: NextApiResponse, error: string | Error) {
  console.error(error);
  res.status(500).json({
    status: 'error',
    message: 'an error occurred processing request'
  });
}

export const normalizeId = (id: string) => {
  if (!id) return id;
  if (id.length === 36) return id;
  if (id.length !== 32) {
    throw new Error(
      `Invalid blog-index-id: ${id} should be 32 characters long. Info here https://github.com/ijjk/notion-blog#getting-blog-index-and-token`
    );
  }
  return `${id.substr(0, 8)}-${id.substr(8, 4)}-${id.substr(12, 4)}-${id.substr(
    16,
    4
  )}-${id.substr(20)}`;
};
