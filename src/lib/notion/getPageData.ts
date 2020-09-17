import rpc, { values } from './rpc';

export default async function getPageData(
  pageId: string,
  removeTableBlocks = true
) {
  try {
    const data = await loadPageChunk({ pageId });
    const blocks = values(data.recordMap.block);

    if (removeTableBlocks) {
      if (blocks[0] && blocks[0].value.content) {
        // remove table blocks
        blocks.splice(1, 2);
      }
    }

    return { blocks };
  } catch (err) {
    console.error(`Failed to load pageData for ${pageId}`, err);
    return { blocks: [] };
  }
}

export function loadPageChunk({
  pageId,
  limit = 100,
  cursor = { stack: [] },
  chunkNumber = 0,
  verticalColumns = false
}: any) {
  return rpc('loadPageChunk', {
    pageId,
    limit,
    cursor,
    chunkNumber,
    verticalColumns
  });
}
