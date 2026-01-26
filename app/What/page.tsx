"use client";

import NavBar from "@/components/navbar/navbar";
import CategorySideBar from "@/components/What/categorySideBar";

export default function What() {

  return (<div>

    <div>
      <NavBar
        font="sans"
        color="#ffffff"
      />

    </div>

    <CategorySideBar />

  </div>)
}