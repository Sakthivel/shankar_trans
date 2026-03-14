"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";

interface User {
  id: number;
  userId: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const emptyForm = { userId: "", password: "", name: "", email: "", role: "STAFF" };

export default function UsersPage() {
  const { isRole } = useAuth();
  const [data, setData] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: User[]; totalPages: number }>("/users", { page, limit: 10 });
      setData(res.data);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  if (!isRole("OWNER")) {
    return <p className="text-center py-12 text-gray-500">Access denied. Owner role required.</p>;
  }

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (u: User) => {
    setEditing(u);
    setForm({ userId: u.userId, password: "", name: u.name, email: u.email, role: u.role });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        const body: Record<string, string> = { name: form.name, email: form.email, role: form.role };
        if (form.password) body.password = form.password;
        await api.put(`/users/${editing.id}`, body);
        toast.success("User updated");
      } else {
        await api.post("/users", form);
        toast.success("User created");
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const columns = [
    { key: "sno", label: "S.No", render: (_: User, i?: number) => (page - 1) * 10 + (i ?? 0) + 1 },
    { key: "userId", label: "User ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (r: User) => (
      <Badge variant={r.role === "OWNER" ? "danger" : r.role === "MANAGER" ? "warning" : "info"}>{r.role}</Badge>
    )},
    { key: "status", label: "Status", render: (r: User) => (
      <Badge variant={r.status === "ACTIVE" ? "success" : "danger"}>{r.status}</Badge>
    )},
    { key: "actions", label: "Actions", render: (r: User) => (
      <div className="flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); openEdit(r); }} className="p-1 hover:bg-gray-100 rounded"><Edit2 size={16} /></button>
        <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} className="p-1 hover:bg-red-100 rounded text-red-600"><Trash2 size={16} /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-indigo-950">Users</h2>
        <Button onClick={openAdd}><Plus size={18} className="mr-2" />Add User</Button>
      </div>
      <DataTable columns={columns} data={data} page={page} totalPages={totalPages} onPageChange={setPage} loading={loading} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit User" : "Add User"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editing && <Input label="User ID" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} required />}
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label={editing ? "New Password (leave blank to keep)" : "Password"} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editing} />
          <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} options={[{ value: "STAFF", label: "Staff" }, { value: "MANAGER", label: "Manager" }, { value: "OWNER", label: "Owner" }]} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editing ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
