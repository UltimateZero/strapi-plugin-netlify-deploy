import React, { memo, useEffect, useState, useRef, useCallback } from "react";
import pluginId from "../../pluginId";
import { useGlobalContext, request } from "strapi-helper-plugin";
import { Button, Padded, Text } from "@buffetjs/core";
import { Header } from "@buffetjs/custom";
export const IMAGE_PULL_INTERVAL = 10000;

const getImageUrl = (siteId) => {
  const baseUrl = `https://api.netlify.com/api/v1/badges/${siteId}/deploy-status`;
  const time = new Date().getTime();

  return `${baseUrl}?${time}`;
};

const SiteItem = (props) => {
  const { site, onDeploy } = props;
  const { title, buildHookId, apiId } = site;
  const { formatMessage } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const useBadgeImage = (siteId) => {
    const [src, setSrc] = useState(() => getImageUrl(siteId));
    const update = useCallback(() => setSrc(getImageUrl(siteId)), [siteId]);

    useEffect(() => {
      const interval = window.setInterval(update, IMAGE_PULL_INTERVAL);
      return () => window.clearInterval(interval);
    }, [update]);

    return [src, update];
  };

  const [badge, updateBadge] = useBadgeImage(apiId);

  const useDeploy = (buildHookId, onDeploy, updateBadge, setLoading) => {
    const timeoutRef = useRef(-1);
    useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

    return useCallback(async () => {
      setLoading(true);
      await onDeploy(buildHookId);
      setLoading(false);
      timeoutRef.current = window.setTimeout(updateBadge, 1000);
    }, [buildHookId, onDeploy, updateBadge, setLoading]);
  };

  const handleDeploy = useDeploy(
    buildHookId,
    onDeploy,
    updateBadge,
    setLoading
  );

  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column nowrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <Text fontWeight="bold" fontSize="md">
        {title}
      </Text>
      <img
        src={badge}
        style={{
          display: "block",
          width: "150px",
          height: "22px",
        }}
      />
      <Button color="primary" isLoading={loading} onClick={handleDeploy}>
        {formatMessage({ id: "netlify-deploy.sites.deploy" })}
      </Button>
    </div>
  );
};

const HomePage = () => {
  const { formatMessage } = useGlobalContext();

  const [sites, setSites] = useState([]);

  useEffect(() => {
    const getSites = async () => {
      const { sites } = await request(`/${pluginId}/sites`, { method: "GET" });
      setSites(sites);
    };

    getSites();

    return () => {};
  }, []);

  const triggerDeploy = async (buildHookId) => {
    const { status } = await request(
      `/${pluginId}/deploy/${encodeURIComponent(buildHookId)}`,

      { method: "GET" }
    );
    if (status === 200) {
      strapi.notification.toggle({
        type: "success",
        message: formatMessage({ id: "netlify-deploy.notification.success" }),
      });
    } else {
      strapi.notification.toggle({
        type: "warning",
        message: formatMessage({ id: "netlify-deploy.notification.error" }),
      });
    }
  };

  return (
    <Padded size="md" top left bottom right>
      <Header
        title={{ label: formatMessage({ id: "netlify-deploy.title" }) }}
        content={formatMessage({ id: "netlify-deploy.description" })}
      />
      <p>{formatMessage({ id: "netlify-deploy.sites.text" })}</p>
      <div
        style={{
          display: "flex",
          flexFlow: "row wrap",
          marginTop: "40px",
          gap: "30px",
        }}
      >
        {sites.map((site, i) => (
          <SiteItem key={i} site={site} onDeploy={triggerDeploy} />
        ))}
      </div>
    </Padded>
  );
};

export default memo(HomePage);
