import { loadPageChunk } from './getPageData';
import { values } from './rpc';

// const nonPreviewTypes = new Set(['editor', 'page', 'collection_view']);

export async function getPostPreview(pageId: string) {
  let blocks;
  // let dividerIndex = 0;

  const data = await loadPageChunk({ pageId, limit: 10 });
  blocks = values(data.recordMap.block);
  let previewText = '';
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].value.type === 'text' && blocks[i].value.properties) {
      const titles: [string, any][] = blocks[i].value.properties.title;
      if (blocks[i].value.properties) {
        const blockText = titles.map(t => t[0]).join('');
        // 足して150を超える場合はその時点でやめる
        if (previewText.length + blockText.length > 150) {
          break;
        }
        previewText += titles.map(t => t[0]).join('');
      }
    }
  }

  /*
  // 最初にdividerがでたところまでをpreviewとする
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].value.type === 'divider') {
      dividerIndex = i;
      break;
    }
  }

  blocks = blocks
    .splice(0, dividerIndex)
    .filter(
      ({ value: { type, properties } }: any) =>
        !nonPreviewTypes.has(type) && properties
    )
    .map((block: any) => block.value.properties.title);
  return blocks;
  */
  return previewText;
}
