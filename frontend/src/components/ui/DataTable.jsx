import React from "react";

export default function DataTable({
                                      columns,
                                      rows,
                                      keyField = "id",
                                      onRowClick,
                                      emptyMessage = "No records found.",
                                      className = "",
                                      dense = false
                                  }) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                <tr className="border-b border-slate-200">
                    {columns.map((c) => (
                        <th key={c.key}
                            className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 ${c.thClassName || ""}`}>
                            {c.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {rows.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-slate-400">
                            {emptyMessage}
                        </td>
                    </tr>
                ) : (
                    rows.map((row) => (
                        <tr
                            key={row[keyField]}
                            onClick={onRowClick ? () => onRowClick(row) : undefined}
                            className={`transition-colors ${onRowClick ? "cursor-pointer" : ""} hover:bg-slate-50/70`}
                        >
                            {columns.map((c) => (
                                <td key={c.key}
                                    className={`px-4 ${dense ? "py-2.5" : "py-3.5"} align-middle text-sm text-ink-700 ${c.className || ""}`}>
                                    {c.render ? c.render(row) : row[c.key]}
                                </td>
                            ))}
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}