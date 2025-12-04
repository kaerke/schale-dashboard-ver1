import { setGlobalDispatcher, Agent, ProxyAgent } from 'undici';
import { appConfig } from '../config/app.js';

export const configureProxy = () => {
  const PROXY_URL = appConfig.server.proxyUrl;

  if (PROXY_URL) {
    console.log(`[Server] Configuring proxy agent: ${PROXY_URL}`);
    const proxyAgent = new ProxyAgent({
      uri: PROXY_URL,
      connect: {
        timeout: 30000
      }
    });
    setGlobalDispatcher(proxyAgent);
  } else {
    console.log('[Server] No HTTP_PROXY set, using direct connection.');
    const agent = new Agent({ connectTimeout: 30000 });
    setGlobalDispatcher(agent);
  }
};
