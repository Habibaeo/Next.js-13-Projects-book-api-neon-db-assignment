/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    PGHOST: "ep-lively-resonance-748842.us-east-2.aws.neon.tech",
    PGDATABASE: "neondb",
    PGUSER: "habibaeo123",
    PGPASSWORD: "vNcWxo0dUYk6",
    NEON_DATABASE_URL:
      "postgres://habibaeo123:GBkqX95CmENF@ep-lively-resonance-748842.us-east-2.aws.neon.tech/neondb",
  },
};

module.exports = nextConfig;
