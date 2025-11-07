// app/icon.tsx
import { getBandData } from "@/lib/client";
import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default async function Icon() {
  const bandData = await getBandData();

  return new ImageResponse(
    <img src={bandData.icon.url} width={32} height={32} />,
    size
  );
}
