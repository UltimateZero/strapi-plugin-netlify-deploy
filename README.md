# Strapi plugin netlify-deploy

Deploy Netlify sites from Strapi Admin panel.

## Installation

```
npm install --save strapi-plugin-netlify-deploy
npm run build --clean
npm run develop
```

## Configuration

Inside your plugins configuration file:

```javascript
// config/plugins.js

module.exports = ({ env }) => ({
  // ...
  "netlify-deploy": {
    sites: [
        {
            title: 'Your site name',
            apiId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // Get it from Netlify site "General" settings
            buildHookId: 'xxxxxxxxxxxxxxxxxxxxxxxx' // Last part of the build hook URL (e.g. https://api.netlify.com/build_hooks/xxxxxxxxxxxxxxxxxxxxxxxx)
        },
        {
            title: 'Another site',
            apiId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            buildHookId: 'xxxxxxxxxxxxxxxxxxxxxxxx' 
        },
        // ...
    ]
  },
  // ...
});
```