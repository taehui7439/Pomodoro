"use client";

import { useState } from "react";
import Image from "next/image";

export default function Category() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button className="box-border flex flex-row justify-center items-center p-2 px-4 gap-2 border border-[1.5px] border-black/11 rounded-[20px] flex-none order-1 grow-0">
      <div className="w-[8px] h-[8px] bg-[#FFA87C] flex-none order-0 grow-0 rounded-[20px]" />
      <p className="h-[13px] font-inter font-normal text-[12px] leading-[13px] flex items-center text-black flex-none order-1 grow-0">
        카테고리
      </p>
      <div className="flex flex-col justify-center items-center p-1 px-0.5 gap-2 w-[10px] h-[10px] flex-none order-2 grow-0">
        <Image src="/images/category/Vector.svg" alt="Category icon" width={8} height={8} />
      </div>
    </button>
  );
}
