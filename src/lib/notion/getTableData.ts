import Slugger from 'github-slugger';

import { normalizeSlug } from '../blog-helpers';
import queryCollection from './queryCollection';
import { values } from './rpc';

type postDataType = {
  id: string;
  Page: string;
  Slug: string;
  Date: number | null;
  Tags: string | null;
  Icon?: string;
  Authors: string[] | null;
  Published: 'Yes' | 'No';
};

type pageFormat =
  | {
      page_icon?: string; // as Emoji
      page_cover?: string; // カバー画像パス ('/images/page-cover/xxx.jpg')
      page_cover_position?: number; // カバーポジション (0〜1?)
      // 他にもあるかも・・
    }
  | undefined;

export default async function loadTable(
  collectionBlock: any,
  isPosts = false
): Promise<postDataType[]> {
  const slugger = new Slugger();

  const { value } = collectionBlock;
  let table: postDataType[] = [];
  const col = (await queryCollection({
    collectionId: value.collection_id,
    collectionViewId: value.view_ids[0]
  })) as any;
  const entries = values(col.recordMap.block).filter((block: any) => {
    return block.value && block.value.parent_id === value.collection_id;
  });

  const colId = Object.keys(col.recordMap.collection)[0];
  const schema = col.recordMap.collection[colId].value.schema;
  const schemaKeys = Object.keys(schema);
  // console.log(entries);

  for (const entry of entries) {
    /**
      {
        id: 'fc1d3efd-e642-4ba9-a990-068fcaa2f930',
        version: 241,
        type: 'page',
        properties: {
          'S6_"': [ [Array] ], // slug
          'a`af': [ [Array] ], // Date
          'cby|': [ [Array] ], // tags
          ijjk: [ [Array] ],  // user
          'la`A': [ [Array] ], // published
          title: [ [Array] ]
        },
        content: [
          '8e782a9c-e63b-4075-bb4f-b73cd87a2840',
          ...
        ],
        created_time: 1597761660000,
        last_edited_time: 1597825260000,
        parent_id: 'c6f13192-cf9e-4dc5-993c-a52761f74663',
        parent_table: 'collection',
        alive: true,
        created_by_table: 'notion_user',
        created_by_id: '87073fb0-023d-4a14-981a-4b3c10dcced0',
        last_edited_by_table: 'notion_user',
        last_edited_by_id: '87073fb0-023d-4a14-981a-4b3c10dcced0',
        shard_id: 188898,
        space_id: '68d88f28-7a7d-4505-ad96-02c5da02e1e2'
      }
     */
    const props = entry.value && entry.value.properties;
    // ページアイコンはこのformatの中にある
    const format: pageFormat = entry.value && entry.value.format;
    const row: any = {};

    if (!props) continue;
    if (entry.value.content) {
      row.id = entry.value.id;
    }

    schemaKeys.forEach(key => {
      // might be undefined
      let val = props[key] && props[key][0][0];

      // authors and blocks are centralized
      if (val && props[key][0][1]) {
        const type = props[key][0][1][0];

        switch (type[0]) {
          case 'a': // link
            val = type[1];
            break;
          case 'u': // user
            val = props[key]
              .filter((arr: any[]) => arr.length > 1)
              .map((arr: any[]) => arr[1][0][1]);
            break;
          case 'p': // page (block)
            const page = col.recordMap.block[type[1]];
            row.id = page.value.id;
            val = page.value.properties.title[0][0];
            break;
          case 'd': // date
            // start_date: 2019-06-18
            // start_time: 07:00
            // time_zone: Europe/Berlin, America/Los_Angeles

            if (!type[1].start_date) {
              break;
            }
            // initial with provided date
            const providedDate = new Date(
              type[1].start_date + ' ' + (type[1].start_time || '')
            ).getTime();

            // calculate offset from provided time zone
            const timezoneOffset =
              new Date(
                new Date().toLocaleString('en-US', {
                  timeZone: type[1].time_zone
                })
              ).getTime() - new Date().getTime();

            // initialize subtracting time zone offset
            val = new Date(providedDate - timezoneOffset).getTime();
            break;
          default:
            console.error('unknown type', type[0], type);
            break;
        }
      }

      if (typeof val === 'string') {
        val = val.trim();
      }
      row[schema[key].name] = val || null;
    });

    // Slugがない場合はtitleからslugをauto-generateする
    row.Slug = normalizeSlug(row.Slug || slugger.slug(row.Page || ''));

    if (format && format.page_icon) {
      row.Icon = format.page_icon;
    }

    const key = row.Slug;
    if (isPosts && !key) continue;

    // 同じslugの場合は無視する
    const postExist = table.findIndex(({ Slug }) => Slug === key) > -1;

    if (key && !postExist) {
      table.push(row);
    }
  }

  // 日付順にする
  table.sort((a, b) => {
    if (a.Date < b.Date) {
      return 1;
    }
    if (a.Date > b.Date) {
      return -1;
    }
    return 0;
  });
  return table; //.reverse();
}
