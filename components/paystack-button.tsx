"use client";

// import { usePaystackPayment } from "react-paystack";
import { useRouter } from "next/navigation";

const PAYSTACK_PUBLIC_KEY = "pk_test_f943af330ed1405d4b95d4b01e207f842b839420"; // use pk_test_ not sk_test_

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

export default function PaystackButton({ form }: { form: Form }) {
  const router = useRouter();

  const config = {
    reference: `order_${Date.now()}`,
    email: form.email,
    amount: 10000 * 100,
    publicKey: PAYSTACK_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: `${form.firstName} ${form.lastName}`,
        },
        {
          display_name: "Phone",
          variable_name: "phone",
          value: form.phone,
        },
        {
          display_name: "Delivery Address",
          variable_name: "address",
          value: `${form.address}, ${form.city}, ${form.state}, ${form.country}`,
        },
      ],
    },
  };

//   const initializePayment = usePaystackPayment(config);

  const handlePay = () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state
    ) {
      alert("Please fill in all required fields before proceeding.");
      return;
    }

    // initializePayment({
    //   onSuccess: () => {
    //     const params = new URLSearchParams({
    //       firstName: form.firstName,
    //       phone: form.phone,
    //       city: form.city,
    //       state: form.state,
    //     });
    //     router.push(`/checkout-success?${params.toString()}`);
    //   },
    //   onClose: () => {},
    // });
  };

  return (
    <button onClick={handlePay} className="primary-btn checkout-submit-btn">
      Place Order
    </button>
  );
}