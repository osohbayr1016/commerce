"use client";

import SearchButton from "./SearchButton";

export default function MainNavClient() {
  return (
    <>
      <div className="sm:hidden fixed bottom-20 right-4 z-40">
        <SearchButton />
      </div>
    </>
  );
}
