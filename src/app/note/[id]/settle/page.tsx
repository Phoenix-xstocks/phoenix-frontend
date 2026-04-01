import { PageContainer } from '@/components/layout/PageContainer';

export default function SettlePage({ params }: { params: { id: string } }) {
  return (
    <PageContainer title={`Settle Note #${params.id}`} subtitle="Choose your settlement option">
      <div className="bg-surface rounded-xl border border-border p-8 text-center text-muted">
        KI Settlement coming in Phase 5
      </div>
    </PageContainer>
  );
}
