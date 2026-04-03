/**
 * Pagination Component - Modern pagination UI
 */

"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/utils/helpers";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  showEllipsis?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  showEllipsis = true,
}: PaginationProps) {
  const maxVisible = 7;
  const halfWindow = Math.floor(maxVisible / 2);

  let startPage = Math.max(1, currentPage - halfWindow);
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  const PaginationButton = ({
    isActive,
    children,
    onClick,
    disabled,
  }: {
    isActive?: boolean;
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "h-10 min-w-10 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center",
        isActive
          ? "bg-[var(--primary)] text-black shadow-elevation-2"
          : "bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:bg-[var(--bg-slight)] border border-[var(--border-default)] hover:border-[var(--primary)]",
        (disabled || isLoading) && "opacity-50 cursor-not-allowed",
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap py-6 px-4">
      {/* First Page Button */}
      <PaginationButton
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className="h-4 w-4" />
      </PaginationButton>

      {/* Previous Page Button */}
      <PaginationButton
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </PaginationButton>

      {/* First Page if not in range */}
      {startPage > 1 && (
        <>
          <PaginationButton
            onClick={() => onPageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationButton>
          {showEllipsis && startPage > 2 && (
            <span className="text-[var(--text-muted)]">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <PaginationButton
          key={page}
          isActive={currentPage === page}
          onClick={() => onPageChange(page)}
        >
          {page}
        </PaginationButton>
      ))}

      {/* Last Page if not in range */}
      {endPage < totalPages && (
        <>
          {showEllipsis && endPage < totalPages - 1 && (
            <span className="text-[var(--text-muted)]">...</span>
          )}
          <PaginationButton
            onClick={() => onPageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationButton>
        </>
      )}

      {/* Next Page Button */}
      <PaginationButton
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </PaginationButton>

      {/* Last Page Button */}
      <PaginationButton
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
      </PaginationButton>

      {/* Info Text */}
      <div className="ml-auto text-sm text-[var(--text-muted)]">
        Page{" "}
        <span className="font-semibold text-[var(--text-primary)]">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-[var(--text-primary)]">
          {totalPages}
        </span>
      </div>
    </div>
  );
}
