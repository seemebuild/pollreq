import { PublicPollShell } from "@/components/public-poll-shell";

export default async function PublicPollPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="page-shell">
      <div className="hero-grid" style={{ gridTemplateColumns: "1fr" }}>
        <PublicPollShell slug={slug} />
      </div>
    </main>
  );
}
