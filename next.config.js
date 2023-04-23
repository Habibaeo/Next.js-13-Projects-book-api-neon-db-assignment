/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
     
  },
  env: {
    PGHOST: "ep-winter-leaf-390104.us-east-2.aws.neon.tech",
    PGDATABASE: "neondb",
    PGUSER: "habibaeo123",
    PGPASSWORD: "86bwYLtNrSOs",
    NEON_DATABASE_URL:
      "postgres://habibaeo123:86bwYLtNrSOs@ep-winter-leaf-390104.us-east-2.aws.neon.tech/neondb",
  },
};

module.exports = nextConfig;