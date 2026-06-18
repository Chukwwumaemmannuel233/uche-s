"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminShell, adminStyles } from "@/components/admin-shell";
import type { TransactionRecord } from "@/lib/admin-store";

export default function AdminTransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      const auth = await fetch("/api/admin/me");
      const authData = await auth.json();
      if (!authData.admin) {
        router.push("/admin");
        return;
      }

      fetch("/api/admin/transactions")
        .then((response) => response.json())
        .then(setTransactions)
        .catch(() => toast.error("Could not load transactions"))
        .finally(() => setLoading(false));
    }

    loadTransactions();
  }, [router]);

  return (
    <AdminShell active="/admin/transactions">
      <div className={adminStyles.topbar}>
        <div>
          <h1 className={adminStyles.title}>Transactions</h1>
          <p className={adminStyles.sub}>Paystack payment records and webhook updates.</p>
        </div>
      </div>

      <div className={adminStyles.tableWrap}>
        <table className={adminStyles.table}>
          <thead>
            <tr>
              {["Reference", "Order", "Amount", "Status", "Channel", "Customer"].map(
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
                  Loading transactions...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td className={adminStyles.td} colSpan={6}>
                  No transactions recorded yet.
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction.reference} className="hover:bg-slate-50">
                  <td className={`${adminStyles.td} font-black text-[#1273c4]`}>
                    {transaction.reference}
                  </td>
                  <td className={adminStyles.td}>{transaction.orderId || "Pending"}</td>
                  <td className={adminStyles.td}>
                    NGN {new Intl.NumberFormat("en-NG").format(transaction.amount)}
                  </td>
                  <td className={adminStyles.td}>{transaction.status}</td>
                  <td className={adminStyles.td}>{transaction.channel || "-"}</td>
                  <td className={adminStyles.td}>{transaction.customerEmail || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
