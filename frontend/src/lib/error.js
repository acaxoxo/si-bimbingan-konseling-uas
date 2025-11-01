
export function formatAxiosError(err, fallback = "Terjadi kesalahan. Coba lagi nanti.") {
  if (!err) return fallback;
  if (err.response?.data?.message) return err.response.data.message;
  if (err.message) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return fallback;
  }
}
