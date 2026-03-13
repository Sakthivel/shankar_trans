"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

export interface Column<T = Record<string, unknown>> {
  key: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: Column<any>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowClick?: (row: any) => void;
}

export function DataTable({
  columns,
  data,
  page = 1,
  totalPages = 1,
  onPageChange,
  loading,
  onRowClick,
}: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={i}
                  className={`hover:bg-gray-50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {col.render ? col.render(row) : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
