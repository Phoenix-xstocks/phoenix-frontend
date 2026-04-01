import { redirect } from 'next/navigation';

export default function SettlePage({ params }: { params: { id: string } }) {
  redirect(`/app/note/${params.id}`);
}
