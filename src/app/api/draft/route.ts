import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getLiveDetail } from "@/lib/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const draftKey = searchParams.get("draftKey");

  if (!slug || !draftKey) {
    return new Response("Invalid skeleton", { status: 401 });
  }

  const post = await getLiveDetail(slug, {
    draftKey,
  });

  if (!post) {
    return new Response("Invalid slug", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(`/live/${post.id}?draftKey=${draftKey}`);
}
