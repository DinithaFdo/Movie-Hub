const runtimeConfig = {
  tmdbApiKey: process.env.TMDB_API_KEY,
  vidsrcBaseUrl:
    process.env.NEXT_PUBLIC_VIDSRC_BASE_URL || "https://vidsrc.cc/v2/embed",
};

export function getRequiredEnvValue(
  value: string | undefined,
  keyName: string,
): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${keyName}`);
  }

  return value;
}

export const env = runtimeConfig;
