import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // 各エリア追加のたびにMOCK_STUDIOS/getMockRoomsWithSlots(src/lib/mock-data.ts)経由で
    // クライアントへ同梱されるJSONデータが増え続け、2026-09-21の松戸・柏エリア追加で
    // 単一chunkがCloudflare Workersの単一アセット上限25MiBを超過してデプロイが失敗した
    // （27.5MiB）。webpackのchunk分割上限を明示することで、同じ合計データ量でも
    // 単一ファイルが25MiBを超えないよう複数chunkへ強制分割する（アプリの挙動・UXは無変更）。
    if (config.optimization?.splitChunks && typeof config.optimization.splitChunks === 'object') {
      config.optimization.splitChunks.maxSize = 20 * 1024 * 1024;
    }
    return config;
  },
};

export default nextConfig;
