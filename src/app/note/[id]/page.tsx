import { PageContainer } from '@/components/layout/PageContainer';

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  return (
    <PageContainer title={`Note #${params.id}`} subtitle="Note details and performance">
      <div className="bg-surface rounded-xl border border-border p-8 text-center text-muted">
        Note detail coming in Phase 4
      </div>
    </PageContainer>
  );
}
