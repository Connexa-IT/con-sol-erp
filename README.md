# Steps to configure reload

In order to be able to develop local changes in Tabidoo JS/Stylesheet it's best to use local override

## Stylesheets

1. Open Chrome DevTools (have better capabilities compared to e.g. Safari)
2. Go to Sources -> Overides and add project folder as override
3. To make file management a little bit more comfortable it's preferred to keep files in the root or file specific folders like (stylesheet, typescript, buidl etc.)
4. To map the responses to the files the path need to match perfectly, e.g. `app.tabidoo.cloud/branding/custom.css?v=2404130802`
5. Make file link to map needed destination, e.g. `ln  ../../custom.css custom.css\?v=2404130802`
6. Changes in styles will be immediatelly propagated into the website

## Scripts

To automatically watch for changes in `./widgets` directory and sync every change you do, run:

```bash
npm run sync:watch
```

If you want to do one-time sync, run:

```bash
npm run sync
```

__Note__: Don't forget to run `npm install` after downloading repository to install all dependencies.
