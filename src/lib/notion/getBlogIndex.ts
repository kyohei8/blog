// import { Sema } from 'async-sema';

// import { lchmod } from 'fs';

import { readFile, writeFile } from '../fs-helpers';
// import createTable from './createTable';
// import { getPostPreview } from './getPostPreview';
import getTableData from './getTableData';
import rpc, { values } from './rpc';
import { BLOG_INDEX_CACHE, BLOG_INDEX_ID } from './server-constants';

// TODO any直す
export default async function getBlogIndex(previews = true): Promise<any[]> {
  let postsTable: any[] = null;
  const useCache = process.env.USE_CACHE === 'true';
  const cacheFile = `${BLOG_INDEX_CACHE}${previews ? '_previews' : ''}`;

  if (useCache) {
    try {
      postsTable = JSON.parse(await readFile(cacheFile, 'utf8'));
      console.log(`cache: "${cacheFile}"を利用します。`);
    } catch (_) {
      /* not fatal */
      console.log(
        `cache: "${cacheFile}"が存在しませんでした。サーバから取得します。`
      );
    }
  }

  if (!postsTable) {
    try {
      const data = (await rpc('loadPageChunk', {
        pageId: BLOG_INDEX_ID,
        limit: 100, //　上げすぎるのとエラーになる TODO: figure out Notion's way of handling pagination
        cursor: { stack: [] },
        chunkNumber: 0,
        verticalColumns: false
      })) as any;
      // Parse table with posts
      const tableBlock = values(data.recordMap.block).find(
        (block: any) => block.value.type === 'collection_view'
      );

      postsTable = await getTableData(tableBlock, true);
    } catch (err) {
      console.warn(
        `Failed to load Notion posts, attempting to auto create table`
      );
      console.error(err.message);
      try {
        // await createTable();
        // console.log(`Successfully created table in Notion`);
      } catch (err) {
        console.error(
          `Auto creating table failed, make sure you created a blank page and site the id with BLOG_INDEX_ID in your environment`,
          err
        );
      }
      return [];
    }

    /*
    // only get 10 most recent post's previews
    // 10件分だけpreviewを取得（いらないのでは・・）
    const postsKeys = Object.keys(postsTable).splice(0, 10);

    const sema = new Sema(3, { capacity: postsKeys.length });

    if (previews) {
      await Promise.all(
        postsKeys
          .sort((a, b) => {
            const postA = postsTable[a];
            const postB = postsTable[b];
            const timeA = postA.Date;
            const timeB = postB.Date;
            return Math.sign(timeB - timeA);
          })
          .map(async postKey => {
            await sema.acquire();
            const post = postsTable[postKey];
            post.preview = post.id
              ? await getPostPreview(postsTable[postKey].id)
              : [];
            sema.release();
          })
      );
    }
    */

    if (useCache) {
      writeFile(cacheFile, JSON.stringify(postsTable), 'utf8').catch(() => {});
    }
  }

  return postsTable;
}
