"use client";

import { useEffect, useState } from "react";
import { CartItem } from "@/contexts/CartContext";

export interface CheckoutFormValues {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  zip: string;
  note: string;
}

interface CheckoutFormProps {
  items: CartItem[];
  defaultValues: CheckoutFormValues;
  onSuccess: () => void;
}

export default function CheckoutForm({
  items,
  defaultValues,
  onSuccess,
}: CheckoutFormProps) {
  const [form, setForm] = useState<CheckoutFormValues>(defaultValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm((prev) => ({ ...prev, ...defaultValues }));
  }, [defaultValues]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: form,
        }),
      });

      if (!response.ok) {
        throw new Error("Захиалга үүсгэхэд алдаа гарлаа");
      }

      onSuccess();
    } catch (err) {
      setError("Захиалга үүсгэхэд алдаа гарлаа");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Нэр"
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
          required
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Утас"
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
          required
        />
      </div>
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Имэйл"
        type="email"
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
        required
      />
      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Хаяг"
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="Хот"
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
        />
        <input
          name="district"
          value={form.district}
          onChange={handleChange}
          placeholder="Дүүрэг"
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
        />
        <input
          name="zip"
          value={form.zip}
          onChange={handleChange}
          placeholder="Zip"
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
        />
      </div>
      <textarea
        name="note"
        value={form.note}
        onChange={handleChange}
        placeholder="Тэмдэглэл"
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
        rows={4}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-gray-900 px-6 py-3 text-white text-base font-medium hover:bg-gray-800 disabled:opacity-60"
      >
        {submitting ? "Илгээж байна..." : "Захиалга хийх"}
      </button>
    </form>
  );
}
