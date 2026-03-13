"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api-client";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

interface Vehicle {
  id: number;
  vehicleNumber: string;
  status: string;
}

interface PaginatedResponse {
  success: boolean;
  data: Vehicle[];
  total: number;
  page: number;
  totalPages: number;
}

const PAGE_SIZE = 10;

export default function VehiclesPage() {
  const [data, setData] = useState<Vehicle[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ vehicleNumber: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResponse>("/vehicles", {
        page,
        limit: PAGE_SIZE,
      });
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to fetch vehicles");
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
    setFormData({ vehicleNumber: "" });
    setModalOpen(true);
  };

  const openEditModal = (row: Vehicle) => {
    setEditingId(row.id);
    setFormData({ vehicleNumber: row.vehicleNumber });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData({ vehicleNumber: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleNumber.trim()) {
      toast.error("Please enter vehicle number");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put<{ success: boolean; data: Vehicle }>(
          `/vehicles/${editingId}`,
          formData
        );
        toast.success("Vehicle updated successfully");
      } else {
        await api.post<{ success: boolean; data: Vehicle }>(
          "/vehicles",
          formData
        );
        toast.success("Vehicle added successfully");
      }
      closeModal();
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (row: Vehicle) => {
    setDeletingId(row.id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeletingId(null);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setSubmitting(true);
    try {
      await api.delete(`/vehicles/${deletingId}`);
      toast.success("Vehicle deleted successfully");
      closeDeleteModal();
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSubmitting(false);
    }
  };

  const enrichedData = data.map((row, i) => ({
    ...row,
    sno: (page - 1) * PAGE_SIZE + i + 1,
  }));

  const columns = [
    { key: "sno", label: "S.No" },
    { key: "vehicleNumber", label: "Vehicle Number" },
    {
      key: "status",
      label: "Status",
      render: (row: Vehicle) => (
        <Badge variant={row.status === "ACTIVE" ? "success" : "danger"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Vehicle) => (
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
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              openDeleteModal(row);
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
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
        title={editingId ? "Edit Vehicle" : "Add Vehicle"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Vehicle Number"
            value={formData.vehicleNumber}
            onChange={(e) =>
              setFormData((p) => ({ ...p, vehicleNumber: e.target.value }))
            }
            placeholder="Enter vehicle number"
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

      <Modal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirm Delete"
        size="sm"
      >
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete this vehicle? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={submitting}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
