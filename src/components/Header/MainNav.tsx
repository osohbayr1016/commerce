import MainNavClient from "./MainNavClient";
import { getCategoryTree } from "@/lib/categories";

export default async function MainNav() {
  let navItems: Awaited<ReturnType<typeof getCategoryTree>> = [];
  try {
    const tree = await getCategoryTree(1);
    navItems = tree.length > 0 ? tree : await getCategoryTree();
  } catch {
    navItems = [];
  }
  return <MainNavClient siteName="E-Commerce" navItems={navItems} />;
}
