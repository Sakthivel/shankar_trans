"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit2, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api-client";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

interface DeliveryLocation {
  id: number;
  deliveryLocation: string;
  status: string;
}

interface PaginatedResponse {
  success: boolean;
  data: DeliveryLocation[];
  total: number;
  page: number;
  totalPages: number;
}

const PAGE_SIZE = 10;

export default function DeliveryLocationsPage() {
  const [data, setData] = useState<DeliveryLocation[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ deliveryLocation: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResponse>("/delivery-locations", {
        page,
        limit: PAGE_SIZE,
      });
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to fetch delivery locations"
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ deliveryLocation: "" });
    setModalOpen(true);
  };

  const openEditModal = (row: DeliveryLocation) => {
    setEditingId(row.id);
    setFormData({ deliveryLocation: row.deliveryLocation });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData({ deliveryLocation: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.deliveryLocation.trim()) {
      toast.error("Please enter delivery location");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put<{ success: boolean; data: DeliveryLocation }>(
          `/delivery-locations/${editingId}`,
          formData
        );
        toast.success("Delivery location updated successfully");
      } else {
        await api.post<{ success: boolean; data: DeliveryLocation }>(
          "/delivery-locations",
          formData
        );
        toast.success("Delivery location added successfully");
      }
      closeModal();
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (row: DeliveryLocation) => {
    const newStatus = row.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await api.put(`/delivery-locations/${row.id}`, {
        deliveryLocation: row.deliveryLocation,
        status: newStatus,
      });
      toast.success(`Location ${newStatus === "ACTIVE" ? "activated" : "deactivated"}`);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Status update failed");
    }
  };

  const enrichedData = data.map((row, i) => ({
    ...row,
    sno: (page - 1) * PAGE_SIZE + i + 1,
  }));

  const columns = [
    { key: "sno", label: "S.No" },
    { key: "deliveryLocation", label: "Delivery Location" },
    {
      key: "status",
      label: "Status",
      render: (row: DeliveryLocation) => (
        <Badge variant={row.status === "ACTIVE" ? "success" : "danger"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: DeliveryLocation) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(row);
            }}
          >
            <Edit2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(row);
            }}
          >
            {row.status === "ACTIVE" ? (
              <ToggleRight size={20} className="text-green-600" />
            ) : (
              <ToggleLeft size={20} className="text-red-500" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-indigo-950">Delivery Locations</h1>
        <Button onClick={openAddModal}>
          <Plus size={18} className="mr-2" />
          Add New
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={enrichedData}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Delivery Location" : "Add Delivery Location"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Delivery Location"
            value={formData.deliveryLocation}
            onChange={(e) =>
              setFormData((p) => ({ ...p, deliveryLocation: e.target.value }))
            }
            placeholder="Enter delivery location"
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editingId ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
