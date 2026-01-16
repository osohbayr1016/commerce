"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "./Pagination";

interface PaginationClientProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationClient({ currentPage, totalPages }: PaginationClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />;
}
