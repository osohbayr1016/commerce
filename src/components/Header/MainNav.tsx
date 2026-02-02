import { createClient } from "@/lib/supabase/server";
import MainNavClient from "./MainNavClient";
import { Category } from "@/types";

export default async function MainNav() {
  const siteName = "E-Commerce";
  let headerCategories: Category[] = [];

  try {
    const supabase = await createClient();

    const { data: categoriesData } = await supabase
      .from("categories")
      .select("id, name, slug, name_en, name_mn")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(6);

    if (categoriesData) {
      headerCategories = categoriesData as Category[];
    }
  } catch (error) {
    // Silent fail
  }

  return (
    <MainNavClient siteName={siteName} headerCategories={headerCategories} />
  );
}
