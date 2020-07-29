# Blog from Notion

[Notoion](https://www.notion.so/)の内容を Next.js を介して表示できるようにしてます。

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

# Special Thanks

[ijjk/notion-blog](https://github.com/ijjk/notion-blog)
