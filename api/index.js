let cachedApp;

export default async (req, res) => {
  if (!cachedApp) {
    const mod = await import("../backend/server.js");
    cachedApp = mod.app || mod.default;
  }

  return cachedApp(req, res);
};
