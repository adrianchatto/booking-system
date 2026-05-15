import { redirect } from 'next/navigation'

export default function TenantAdminRoot({ params }: { params: { slug: string } }) {
  redirect(`/${params.slug}/admin/dashboard`)
}
