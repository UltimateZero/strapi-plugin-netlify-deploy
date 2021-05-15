"use strict";

const pluginId = require("../admin/src/pluginId");
const axios = require("axios");

module.exports = {
  sites: async (ctx) => {
    const { sites } = strapi.plugins[pluginId].config;
    ctx.send({
      sites,
    });
  },
  deploy: async (ctx) => {
    const { buildHookId } = ctx.params;
    try {
      const resp = await axios.post(
        `https://api.netlify.com/build_hooks/${buildHookId}`
      );
      ctx.send({ message: "ok", status: resp.status });
    } catch (err) {
      if (err.response) {
        ctx.status = 200;
        return ctx.send({ message: "failed", status: err.response.status });
      }
      console.error("Netlify Deploy: failed to deploy", err);
    }
  },
};
