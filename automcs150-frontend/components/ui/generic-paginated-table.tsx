"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define column configuration type
export interface ColumnDef<T> {
    header: string
    accessorKey?: keyof T
    cell?: (item: T) => React.ReactNode
    className?: string
}

// Define props for the paginated table
export interface GenericPaginatedTableProps<T> {
    data: T[]
    columns: ColumnDef<T>[]
    isServerSide?: boolean
    totalItems?: number
    onPageChange?: (page: number) => void
    onItemsPerPageChange?: (itemsPerPage: number) => void
    keyExtractor: (item: T) => string | number
    emptyMessage?: string
}

export function GenericPaginatedTable<T>({
    data,
    columns,
    isServerSide = false,
    totalItems = 0,
    onPageChange,
    onItemsPerPageChange,
    keyExtractor,
    emptyMessage = "No results found",
}: GenericPaginatedTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(7)

    // For client-side pagination
    const totalPages = isServerSide ? Math.ceil(totalItems / itemsPerPage) : Math.ceil(data.length / itemsPerPage)

    const paginatedData = isServerSide
        ? data // For server-side, we assume data is already paginated
        : data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)

        if (isServerSide && onPageChange) {
            onPageChange(page)
        }
    }

    const handleItemsPerPageChange = (value: string) => {
        const newItemsPerPage = Number.parseInt(value)
        setItemsPerPage(newItemsPerPage)
        setCurrentPage(1) // Reset to first page when changing items per page

        if (isServerSide && onItemsPerPageChange) {
            onItemsPerPageChange(newItemsPerPage)
        }
    }

    return (
        <div className="space-y-4">
            {paginatedData.length > 0 ? (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableHead key={index} className={column.className}>
                                        {column.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map((item) => (
                                <TableRow key={keyExtractor(item)}>
                                    {columns.map((column, index) => (
                                        <TableCell key={index} className={column.className}>
                                            {column.cell
                                                ? column.cell(item)
                                                : column.accessorKey
                                                    ? (item[column.accessorKey] as React.ReactNode)
                                                    : null}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm text-muted-foreground">
                                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                                <span className="font-medium">
                                    {Math.min(currentPage * itemsPerPage, isServerSide ? totalItems : data.length)}
                                </span>{" "}
                                of <span className="font-medium">{isServerSide ? totalItems : data.length}</span> results
                            </p>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium">Rows per page</p>
                                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                                    <SelectTrigger className="h-8 w-[70px]">
                                        <SelectValue placeholder={itemsPerPage} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[5, 7, 10, 20, 50, 100].map((pageSize) => (
                                            <SelectItem key={pageSize} value={pageSize.toString()}>
                                                {pageSize}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="icon" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                                    <span className="sr-only">Go to first page</span>
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <span className="sr-only">Go to previous page</span>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-medium">{currentPage}</span>
                                    <span className="text-sm text-muted-foreground">of</span>
                                    <span className="text-sm font-medium">{totalPages || 1}</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <span className="sr-only">Go to next page</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                >
                                    <span className="sr-only">Go to last page</span>
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">{emptyMessage}</p>
                </div>
            )}
        </div>
    )
}
