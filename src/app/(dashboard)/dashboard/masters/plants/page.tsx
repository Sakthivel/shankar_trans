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

interface LoadingPlant {
  id: number;
  loadingPlant: string;
  status: string;
}

interface PaginatedResponse {
  success: boolean;
  data: LoadingPlant[];
  total: number;
  page: number;
  totalPages: number;
}

const PAGE_SIZE = 10;

export default function LoadingPlantsPage() {
  const [data, setData] = useState<LoadingPlant[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ loadingPlant: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<PaginatedResponse>("/loading-plants", {
        page,
        limit: PAGE_SIZE,
      });
      setData(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to fetch loading plants"
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
    setFormData({ loadingPlant: "" });
    setModalOpen(true);
  };

  const openEditModal = (row: LoadingPlant) => {
    setEditingId(row.id);
    setFormData({ loadingPlant: row.loadingPlant });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData({ loadingPlant: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.loadingPlant.trim()) {
      toast.error("Please enter loading plant name");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put<{ success: boolean; data: LoadingPlant }>(
          `/loading-plants/${editingId}`,
          formData
        );
        toast.success("Loading plant updated successfully");
      } else {
        await api.post<{ success: boolean; data: LoadingPlant }>(
          "/loading-plants",
          formData
        );
        toast.success("Loading plant added successfully");
      }
      closeModal();
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (row: LoadingPlant) => {
    const newStatus = row.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await api.put(`/loading-plants/${row.id}`, {
        loadingPlant: row.loadingPlant,
        status: newStatus,
      });
      toast.success(`Loading plant ${newStatus === "ACTIVE" ? "activated" : "deactivated"}`);
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
    { key: "loadingPlant", label: "Loading Plant" },
    {
      key: "status",
      label: "Status",
      render: (row: LoadingPlant) => (
        <Badge variant={row.status === "ACTIVE" ? "success" : "danger"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: LoadingPlant) => (
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
        <h1 className="text-2xl font-bold text-indigo-950">Loading Plants</h1>
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
        title={editingId ? "Edit Loading Plant" : "Add Loading Plant"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Loading Plant"
            value={formData.loadingPlant}
            onChange={(e) =>
              setFormData((p) => ({ ...p, loadingPlant: e.target.value }))
            }
            placeholder="Enter loading plant name"
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
