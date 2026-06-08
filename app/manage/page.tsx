"use client";
import dynamic from "next/dynamic";
const Manage = dynamic(() => import("@/components/Manage"), { ssr: false });
export default function Page() { return <Manage />; }
