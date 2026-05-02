"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";

interface DiscountGroup { id: string; title: string; customer_tag?: string | null; }

interface ApprovalModalProps {
  applicationId: string;
  companyName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApprovalModal({ applicationId, companyName, onClose, onSuccess }: ApprovalModalProps) {
  const [discountGroups, setDiscountGroups] = useState<DiscountGroup[]>([]);
  const [discountGroupId, setDiscountGroupId] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminService.listDiscountGroups().then(dg => {
      setDiscountGroups(Array.isArray(dg) ? dg as DiscountGroup[] : []);
    }).catch(() => {});
  }, []);

  async function handleApprove(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await adminService.approveApplication(applicationId, {
        discount_group_id: discountGroupId || undefined,
        notes: notes || undefined,
      });
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to approve");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Approve Application</h2>
        <p className="text-sm text-gray-500 mb-4">{companyName}</p>

        <form onSubmit={handleApprove} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Group</label>
            <select
              value={discountGroupId}
              onChange={(e) => setDiscountGroupId(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">None</option>
              {discountGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}{g.customer_tag ? ` (${g.customer_tag})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes for the company"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 rounded-md py-2 text-sm hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-green-600 text-white rounded-md py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {isSaving ? "Approving…" : "Approve"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
