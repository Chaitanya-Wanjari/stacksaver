import { createServiceSupabaseClient } from "@/lib/db/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>;
}) {
  const params = await searchParams;

  if (params.password !== process.env.ADMIN_PASSWORD) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold">Admin access required</h1>
        <p className="mt-2 text-muted-foreground">
          Add ?password=YOUR_ADMIN_PASSWORD to view this dashboard.
        </p>
      </main>
    );
  }

  const supabase = createServiceSupabaseClient();

  const [{ count: auditCount }, { count: leadCount }, { data: leads }] =
    await Promise.all([
      supabase.from("audits").select("*", { count: "exact", head: true }),
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  const highSavingsCount =
    leads?.filter((lead) => lead.is_high_savings).length || 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-bold">StackSaver Admin</h1>
      <p className="mt-2 text-muted-foreground">
        Lead and audit overview for the product.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Metric title="Audits" value={auditCount || 0} />
        <Metric title="Leads" value={leadCount || 0} />
        <Metric title="High-savings recent leads" value={highSavingsCount} />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Email</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Monthly savings</th>
                  <th>Consultation</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {leads?.map((lead) => (
                  <tr key={lead.id} className="border-b">
                    <td className="py-2">{lead.email}</td>
                    <td>{lead.company_name || "-"}</td>
                    <td>{lead.role || "-"}</td>
                    <td>${lead.monthly_savings || 0}</td>
                    <td>{lead.wants_consultation ? "Yes" : "No"}</td>
                    <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}