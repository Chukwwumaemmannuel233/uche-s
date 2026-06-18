"use client";

import { useState } from "react";
import { toast } from "sonner";

export type Form = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  notes: string;
};

type PaystackButtonProps = {
  amount: number;
  form: Form;
  items: { id: string; name: string; quantity: number; price: string; amount: number }[];
};

export default function PaystackButton({ amount, form, items }: PaystackButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state
    ) {
      toast.error("Please fill in all required checkout fields.");
      return;
    }

    setLoading(true);

    try {
      const callbackParams = new URLSearchParams({
        firstName: form.firstName,
        phone: form.phone,
        city: form.city,
        state: form.state,
      });

      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          amount,
          customer: {
            name: `${form.firstName} ${form.lastName}`,
            phone: form.phone,
            city: form.city,
            state: form.state,
          },
          items,
          callbackUrl: `${window.location.origin}/checkout-success?${callbackParams.toString()}`,
          metadata: {
            customer_name: `${form.firstName} ${form.lastName}`,
            phone: form.phone,
            address: `${form.address}, ${form.city}, ${form.state}, ${form.country}`,
            notes: form.notes,
            items,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to start payment.");
      }

      toast.success("Redirecting to Paystack checkout");
      window.location.href = data.authorization_url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to start payment.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      className="primary-btn checkout-submit-btn"
      disabled={loading}
    >
      {loading ? "Starting payment..." : "Place Order"}
    </button>
  );
}
