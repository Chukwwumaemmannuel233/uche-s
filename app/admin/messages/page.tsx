"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminShell, adminStyles } from "@/components/admin-shell";
import type { ContactMessage } from "@/lib/admin-store";

export default function AdminMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMessages() {
      const auth = await fetch("/api/admin/me");
      const authData = await auth.json();
      if (!authData.admin) {
        router.push("/admin");
        return;
      }

      fetch("/api/admin/messages")
        .then((response) => response.json())
        .then(setMessages)
        .catch(() => toast.error("Could not load messages"))
        .finally(() => setLoading(false));
    }

    loadMessages();
  }, [router]);

  return (
    <AdminShell active="/admin/messages">
      <div className={adminStyles.topbar}>
        <div>
          <h1 className={adminStyles.title}>Messages</h1>
          <p className={adminStyles.sub}>Product requests and customer enquiries.</p>
        </div>
      </div>

      <div className={adminStyles.tableWrap}>
        <table className={adminStyles.table}>
          <thead>
            <tr>
              {["Customer", "Phone", "Request", "Product", "Message", "Date"].map(
                (heading) => (
                  <th key={heading} className={adminStyles.th}>
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className={adminStyles.td} colSpan={6}>
                  Loading messages...
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td className={adminStyles.td} colSpan={6}>
                  No customer messages yet.
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr key={message.id} className="hover:bg-slate-50">
                  <td className={`${adminStyles.td} font-black`}>{message.name}</td>
                  <td className={adminStyles.td}>{message.phone}</td>
                  <td className={adminStyles.td}>{message.requestType}</td>
                  <td className={adminStyles.td}>{message.product || "Not specified"}</td>
                  <td className={`${adminStyles.td} min-w-80`}>{message.message}</td>
                  <td className={adminStyles.td}>
                    {new Date(message.createdAt).toLocaleDateString()}
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
