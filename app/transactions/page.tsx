"use client";
import dynamic from "next/dynamic";
const Transactions = dynamic(() => import("@/components/Transactions"), { ssr: false });
export default function Page() { return <Transactions />; }
