# Blog from Notion

[Notion](https://www.notion.so/)の内容を Next.js を介して表示できるようにしてます。

基本的にはこちらをフォークして改良したものです。感謝 😉
[ijjk/notion-blog](https://github.com/ijjk/notion-blog)

- TypeScript
- highlight.js
- PWA with [shadowwalker/next-pwa](https://github.com/shadowwalker/next-pwa)
- CSS with [Tailwind CSS](https://tailwindcss.com/)
- Next.js and Vercel.

## 諸注意

Notion の API は現状「非公開」なので、予告なく止まる可能性があります。

## 始め方

- Notion トークンの取得
- ブログの IndexID を Notion ページから取得

```
$ yarn
$ NOTION_TOKEN='xyz...' BLOG_INDEX_ID='...' yarn dev
```

### キャッシュを利用する場合

キャッシュを利用すると毎回サーバからデータを取得せず、一度取得した内容をローカルファイルに保持し、以降そこからデータを取得します。
（ルートディレクトリの`.blog_index_data_previews`というファイルができます）

```
$ NOTION_TOKEN='xyz...' BLOG_INDEX_ID='...' USE_CACHE=true yarn dev
```

### ローカルビルド

```
$ NOTION_TOKEN='xyz...' BLOG_INDEX_ID='...' yarn build
$ NOTION_TOKEN='xyz...' BLOG_INDEX_ID='...' yarn start
```

## デプロイ

プレビューのデプロイ

```
$ vc
```

本番のデプロイ

```sh
$ vc --prod
```

## Preview モード

- [Preview Mode とは](https://nextjs.org/docs/advanced-features/preview-mode)

以下の URL にアクセスすることで、Preview モードで実行できるようになります。(実際には cookie に`__next_preview_data`と`__prerender_bypass`が設定され、設定されている間は preview モードなる)
Preview モードで実行するとドラフトの記事も表示されるようになります。
(本来は preview 用のデータを返すようなこともできるようだけど、現状はドラフトの表示だけみたい？）

`http://localhost:3000/api/preview?token={NOTION_TOKEN}` を実行

記事の場合は
`http://localhost:3000/api/preview-post?token={NOTION_TOKEN}&slug={Slug}` を実行

Preview モードを抜けたい場合は `http://localhost:3000/api/clear-preview` を呼び出します。

# Special Thanks

[ijjk/notion-blog](https://github.com/ijjk/notion-blog)
