"use client";

import { useState, useEffect } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import HeroDeleteConfirm from "@/components/admin/HeroDeleteConfirm";
import HeroBannerGrid from "./HeroBannerGrid";
import { useModal } from "@/hooks/useModal";
import Skeleton from "@/components/ui/Skeleton";
import { normalizeBanners, isTableMissingError, type Banner } from "./hero-utils";

export default function HeroAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [setupRequired, setSetupRequired] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const modal = useModal();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setSetupRequired(false);
      const res = await fetch("/api/admin/hero");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const msg = errorData.error || `Request failed with status ${res.status}`;
        if (isTableMissingError(msg)) {
          setSetupRequired(true);
          setLoading(false);
          return;
        }
        throw new Error(msg);
      }
      const data = await res.json().catch(() => null);
      setBanners(normalizeBanners(data));
    } catch (error: unknown) {
      modal.showError("Error", "Failed to load banners: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleImagesChange = async (newUrls: string[]) => {
    if (newUrls.length === 0) return;
    if (setupRequired) {
      modal.showError("Setup required", "Run the database setup first, then upload again.");
      return;
    }
    setSaving(true);
    try {
      for (const url of newUrls) {
        const res = await fetch("/api/admin/hero", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_url: url }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error || "Failed to save");
        }
      }
      await fetchBanners();
      modal.showSuccess("Saved", "Image(s) added to home page hero carousel.");
    } catch (error: unknown) {
      modal.showError("Error", error instanceof Error ? error.message : "Failed to save. Run setup first if needed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (id: string) => setConfirmDeleteId(id);

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/hero?id=${encodeURIComponent(confirmDeleteId)}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error || "Failed");
      }
      setBanners((prev) => prev.filter((b) => String(b.id) !== String(confirmDeleteId)));
      modal.showSuccess("Removed", "Image removed from carousel.");
      setConfirmDeleteId(null);
    } catch (e) {
      modal.showError("Error", e instanceof Error ? e.message : "Failed to remove.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelConfirm = () => {
    if (!deleting) setConfirmDeleteId(null);
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-20">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full max-w-xl rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <HeroDeleteConfirm
        isOpen={confirmDeleteId !== null}
        title="Remove from carousel"
        message="Remove this image from the hero carousel?"
        confirmText="Remove"
        cancelText="Cancel"
        isDeleting={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelConfirm}
      />
      <h1 className="text-2xl font-bold text-gray-900">Hero carousel images</h1>
      <p className="text-gray-600 text-sm">Upload images here. They appear in the hero carousel on the home page.</p>

      {setupRequired && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span>Database setup required.</span>
          <a href="/admin/setup-hero" className="font-medium text-amber-900 underline hover:no-underline">Open setup & copy SQL</a>
          <button type="button" onClick={() => { setLoading(true); fetchBanners(); }} className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 font-medium hover:bg-amber-100">I ran the SQL — Retry</button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Upload hero images</h2>
        <p className="text-sm text-gray-500 mb-4">Add one or more images. Each image becomes a slide in the home page hero carousel.</p>
        {saving && <p className="text-sm text-gray-500 mb-2">Saving…</p>}
        <div className={saving ? "pointer-events-none opacity-70" : ""}>
          <ImageUploader images={[]} onImagesChange={handleImagesChange} />
        </div>
      </div>

      <HeroBannerGrid banners={banners} onDelete={handleDeleteClick} />

      {!setupRequired && banners.length === 0 && (
        <p className="text-sm text-gray-500">No images yet. Upload above to add slides to the home page hero carousel.</p>
      )}
    </div>
  );
}
