import React from 'react';
import { ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react';

export default function DataTable({ 
  columns, 
  data, 
  loading = false,
  pagination = null,
  onPageChange,
  searchQuery = '',
  onSearchChange,
  emptyMessage = "No records found"
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      {(onSearchChange !== undefined || pagination) && (
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
          {onSearchChange !== undefined && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}
          
          {pagination && (
            <div className="text-sm text-slate-600 font-medium">
              Total records: {pagination.count}
            </div>
          )}
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto relative min-h-[200px]">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={`px-6 py-4 font-semibold tracking-wider ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center text-primary">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <span className="text-sm font-medium">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center text-slate-500">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <Search className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-base font-medium">{emptyMessage}</p>
                    {searchQuery && <p className="text-sm mt-1">Try adjusting your search criteria</p>}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr 
                  key={row.id || rowIndex} 
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={`px-6 py-4 ${col.cellClassName || ''}`}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.count > 0 && !loading && (
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <span className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{(pagination.page - 1) * 10 + 1}</span> to <span className="font-semibold text-slate-700">{Math.min(pagination.page * 10, pagination.count)}</span> of <span className="font-semibold text-slate-700">{pagination.count}</span> Entries
          </span>
          <div className="inline-flex rounded-lg shadow-sm">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.previous}
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-l-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed focus:z-10 focus:ring-2 focus:ring-primary focus:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.next}
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-r-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed focus:z-10 focus:ring-2 focus:ring-primary focus:text-primary transition-colors -ml-px"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
