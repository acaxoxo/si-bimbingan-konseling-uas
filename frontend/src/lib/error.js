// Simple helper to extract a user-friendly message from Axios-like errors
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
