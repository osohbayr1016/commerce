"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getErrorMessage } from "@/types";
import { FOOTER_BLOCKS, DEFAULT_FOOTER_MAP } from "@/lib/footer-defaults";
import { FooterBlocksForm } from "./FooterBlocksForm";

function mapKey(section: string, key: string) {
  return `${section}:${key}`;
}

export default function FooterPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [tableMissing, setTableMissing] = useState(false);

  const supabase = createClient();

  const fetchContents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("footer_contents")
        .select("section, key, value")
        .order("section", { ascending: true })
        .order("display_order", { ascending: true });

      if (error) {
        const msg = getErrorMessage(error);
        if (msg.includes("schema cache") || msg.includes("does not exist")) {
          setTableMissing(true);
          const fallback: Record<string, string> = {};
          FOOTER_BLOCKS.forEach((b) => {
            const v =
              (DEFAULT_FOOTER_MAP[b.section] as Record<string, string>)?.[b.key] ??
              "";
            fallback[mapKey(b.section, b.key)] = v;
          });
          setValues(fallback);
        } else {
          setMessage(`Error: ${msg}`);
        }
        return;
      }
      setTableMissing(false);
      const map: Record<string, string> = {};
      FOOTER_BLOCKS.forEach((b) => {
        const row = data?.find(
          (r: { section: string; key: string; value: string | null }) =>
            r.section === b.section && r.key === b.key,
        );
        const def =
          (DEFAULT_FOOTER_MAP[b.section] as Record<string, string>)?.[b.key] ?? "";
        map[mapKey(b.section, b.key)] = row?.value ?? def;
      });
      setValues(map);
      setMessage("");
    } catch (error) {
      setMessage(`Error: ${getErrorMessage(error)}`);
      setTableMissing(true);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  function handleChange(section: string, key: string, value: string) {
    setValues((prev) => ({ ...prev, [mapKey(section, key)]: value }));
  }

  async function handleSave() {
    if (tableMissing) {
      setMessage(
        "Хүснэгт байхгүй тул хадгалах боломжгүй. Migration ажиллуулна уу.",
      );
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const rows = FOOTER_BLOCKS.map((b, i) => ({
        section: b.section,
        key: b.key,
        value: values[mapKey(b.section, b.key)] ?? "",
        display_order: i + 1,
        is_active: true,
      }));
      const { error } = await supabase
        .from("footer_contents")
        .upsert(rows, { onConflict: "section,key" });
      if (error) throw error;
      setMessage("Амжилттай хадгалагдлаа");
      await fetchContents();
    } catch (error) {
      setMessage(`Error: ${getErrorMessage(error)}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Footer удирдах
        </h1>
        <p className="text-base text-gray-600">Footer агуулга засах</p>
      </div>

      {tableMissing && (
        <div className="mb-6 p-4 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
          <strong>footer_contents</strong> хүснэгт олдсонгүй. Supabase Dashboard
          → SQL Editor-ээр доорх SQL ажиллуулбал footer засварлагдах болно.
        </div>
      )}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes("Error")
              ? "bg-red-50 text-red-800"
              : "bg-green-50 text-green-800"
          }`}
        >
          {message}
        </div>
      )}

      <FooterBlocksForm
        values={values}
        loading={loading}
        saving={saving}
        tableMissing={tableMissing}
        onChange={handleChange}
        onSave={handleSave}
      />
    </div>
  );
}
