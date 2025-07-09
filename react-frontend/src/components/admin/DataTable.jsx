import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import api from "../../api/axios";

const DataTable = ({
  columns = [],
  apiEndpoint = "/api/users",
  title = "Data Table",
  showDateFilter = true,
  showSearch = true,
  showPagination = true,
  showPerPage = true,
  defaultPerPage = 10,
  onRowClick = null,
  customFilters = [],
  showActions = true,
  onEdit = null,
  onDelete = null,
  onCustomAction = null,
  customActions = [],
  addButton = null,
  onAdd = null,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        per_page: perPage,
        search: debouncedSearchTerm,
        sort_by: sortField,
        sort_dir: sortDirection,
        date_from: dateFrom ? dateFrom.toISOString().split("T")[0] : undefined,
        date_to: dateTo ? dateTo.toISOString().split("T")[0] : undefined,
      };

      const response = await api.get(apiEndpoint, { params });

      const result = response.data;

      setData(result.data);
      setTotalPages(result.last_page);
      setTotalRecords(result.total);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    fetchData();
  }, [
    apiEndpoint,
    currentPage,
    perPage,
    debouncedSearchTerm,
    sortField,
    sortDirection,
    dateFrom,
    dateTo,
  ]);

  const displayColumns = columns;

  // Add actions column if showActions is true
  const finalColumns = showActions
    ? [
        ...displayColumns,
        { key: "actions", title: "Actions", width: "w-24", sortable: false },
      ]
    : displayColumns;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
    setSortField("");
    setSortDirection("asc");
    setCurrentPage(1);
  };

  const handleAdd = () => {
    if (onAdd) {
      onAdd();
    }
  };

  const handleEdit = (row) => {
    if (onEdit) {
      onEdit(row);
    }
  };

  const handleDelete = (row) => {
    if (onDelete) {
      if (
        window.confirm(
          `Are you sure you want to delete ${row.name || "this item"}?`
        )
      ) {
        onDelete(row);
      }
    }
  };

  const renderActionButtons = (row) => {
    const hasDefaultActions = onEdit || onDelete;
    const hasCustomActions = customActions && customActions.length > 0;

    if (!hasDefaultActions && !hasCustomActions) return null;

    return (
      <div className="flex items-center gap-1">
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit"
          >
            <Edit className="w-5 h-5" />
          </button>
        )}

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}

        {hasCustomActions && (
          <div className="relative group">
            <button
              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
              title="More actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {customActions.map((action, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (action.onClick) {
                      action.onClick(row);
                    }
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  {action.icon && <action.icon className="w-4 h-4" />}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 rounded-md text-sm font-medium transition-colors ${
            i === currentPage
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {totalRecords} {totalRecords === 1 ? "record" : "records"} found
            </p>
          </div>
          <div className="flex items-center gap-2">
            {addButton && (
              <button
                onClick={handleAdd}
                className="primary-btn px-3 py-2 text-sm text-white font-medium inline-flex items-center gap-2 rounded-md"
              >
                <Plus size={22} />
                <span>{addButton}</span>
              </button>
            )}
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          {showSearch && (
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border outline-none border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          )}

          {/* Date Filters */}
          {showDateFilter && (
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-400 w-4 h-4" />
              <DatePicker
                selected={dateFrom}
                onChange={(date) => setDateFrom(date)}
                className="px-3 py-2 border border-gray-300 outline-none rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholderText="From"
                dateFormat="yyyy-MM-dd"
              />
              <span className="text-gray-500">to</span>
              <DatePicker
                selected={dateTo}
                onChange={(date) => setDateTo(date)}
                className="px-3 py-2 border border-gray-300 outline-none rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholderText="To"
                dateFormat="yyyy-MM-dd"
              />
            </div>
          )}

          {/* Per Page */}
          {showPerPage && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 whitespace-nowrap">
                Show:
              </span>
              <select
                value={perPage}
                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {finalColumns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider ${
                    column.width || ""
                  } ${
                    column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.title}
                    {column.sortable && (
                      <div className="flex flex-col gap-1.5">
                        <div
                          className={`w-0 h-0 border-l-5 border-r-5 border-b-5 border-l-transparent border-r-transparent ${
                            sortField === column.key && sortDirection === "asc"
                              ? "border-b-blue-600"
                              : "border-b-gray-500"
                          } -mb-1`}
                        />
                        <div
                          className={`w-0 h-0 border-l-5 border-r-5 border-t-5 border-l-transparent border-r-transparent ${
                            sortField === column.key && sortDirection === "desc"
                              ? "border-t-blue-600"
                              : "border-t-gray-500"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={finalColumns.length}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mr-2" />
                    <span className="text-gray-500">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={finalColumns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={`hover:bg-gray-50 transition-colors`}
                >
                  {displayColumns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-6 w-[10%] py-4 whitespace-nowrap text-sm text-gray-900">
                      {renderActionButtons(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * perPage + 1} to{" "}
              {Math.min(currentPage * perPage, totalRecords)} of {totalRecords}{" "}
              results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {renderPagination()}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
