module.exports = async (req, res) => {
  const mod = await import("../backend/server.js");
  const app = mod.app || mod.default;
  return app(req, res);
};
