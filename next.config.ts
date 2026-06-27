import type { NextConfig } from "next";
import os from "os";

function getLocalNetworkIPs() {
  const ips = new Set<string>();

  for (const interfaces of Object.values(os.networkInterfaces())) {
    for (const net of interfaces ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        ips.add(net.address);
      }
    }
  }

  return [...ips];
}

function getAllowedDevOrigins() {
  const origins = new Set(getLocalNetworkIPs());

  for (const value of process.env.ALLOWED_DEV_ORIGINS?.split(",") ?? []) {
    const trimmed = value.trim();
    if (trimmed) {
      origins.add(trimmed);
    }
  }

  return [...origins];
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getAllowedDevOrigins(),
};

export default nextConfig;
