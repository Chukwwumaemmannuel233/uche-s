"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminShell, adminStyles } from "@/components/admin-shell";
import type { AuditLog } from "@/lib/admin-store";

export default function AdminAuditPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAudit() {
      const auth = await fetch("/api/admin/me");
      const authData = await auth.json();
      if (!authData.admin) {
        router.push("/admin");
        return;
      }

      fetch("/api/admin/audit")
        .then((response) => response.json())
        .then(setLogs)
        .catch(() => toast.error("Could not load audit logs"))
        .finally(() => setLoading(false));
    }

    loadAudit();
  }, [router]);

  return (
    <AdminShell active="/admin/audit">
      <div className={adminStyles.topbar}>
        <div>
          <h1 className={adminStyles.title}>Audit Trail</h1>
          <p className={adminStyles.sub}>Security and backend activity records.</p>
        </div>
      </div>

      <div className={adminStyles.tableWrap}>
        <table className={adminStyles.table}>
          <thead>
            <tr>
              {["Action", "Actor", "Entity", "Entity ID", "Date"].map((heading) => (
                <th key={heading} className={adminStyles.th}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className={adminStyles.td} colSpan={5}>
                  Loading audit logs...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td className={adminStyles.td} colSpan={5}>
                  No audit logs yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className={`${adminStyles.td} font-black`}>{log.action}</td>
                  <td className={adminStyles.td}>{log.actor}</td>
                  <td className={adminStyles.td}>{log.entity}</td>
                  <td className={adminStyles.td}>{log.entityId || "-"}</td>
                  <td className={adminStyles.td}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
