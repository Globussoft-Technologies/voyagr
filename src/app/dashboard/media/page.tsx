import { requireMembership } from "@/lib/tenant";
import MediaLibrary from "@/components/media/MediaLibrary";

export default async function MediaPage() {
  await requireMembership();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Media Library</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Upload and manage images for your site.
      </p>
      <div className="mt-8">
        <MediaLibrary />
      </div>
    </div>
  );
}
