import { createClient } from "@/lib/supabase/server";
import { Category } from "@/types";

export async function getCategoryChildren(
  parentId: number,
): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug, name_en, name_mn, name_ru, name_zh, name_it, parent_id, display_order")
    .eq("parent_id", parentId)
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  return (data || []) as Category[];
}

export async function getCategoryDescendantIds(
  categoryId: number,
): Promise<number[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_category_descendant_ids", {
    p_category_id: categoryId,
  });
  if (error || !data || !Array.isArray(data)) {
    return [categoryId];
  }
  return data as number[];
}

export async function getCategoryByPath(
  pathSegments: string[],
): Promise<Category | null> {
  if (!pathSegments || pathSegments.length === 0) return null;

  const supabase = await createClient();
  const path = pathSegments.join("/");

  const { data, error } = await supabase
    .from("categories")
    .select(
      "id, name, slug, name_en, name_mn, name_ru, name_zh, name_it, parent_id, level, path, display_order, is_active",
    )
    .eq("path", path)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return walkPath(supabase, pathSegments);
  }
  return data as Category;
}

async function walkPath(
  supabase: Awaited<ReturnType<typeof createClient>>,
  segments: string[],
): Promise<Category | null> {
  let parentId: number | null = null;
  let lastCategory: Category | null = null;

  for (const slug of segments) {
    let query = supabase
      .from("categories")
      .select(
        "id, name, slug, name_en, name_mn, name_ru, name_zh, name_it, parent_id, level, path, display_order, is_active",
      )
      .eq("slug", slug)
      .eq("is_active", true);

    if (parentId === null) {
      query = query.is("parent_id", null);
    } else {
      query = query.eq("parent_id", parentId);
    }

    const { data, error } = await query.single();
    if (error || !data) return null;
    parentId = data.id;
    lastCategory = data as Category;
  }

  return lastCategory;
}

export async function getCategoryTree(
  levelFilter?: number,
): Promise<Category[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("categories")
    .select(
      "id, name, slug, name_en, name_mn, name_ru, name_zh, name_it, parent_id, level, path, display_order, is_active",
    )
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const flat = (data || []) as Category[];
  const tree = buildCategoryTree(flat);

  if (levelFilter !== undefined) {
    const filtered = tree.filter((r) => (r.level ?? 1) === levelFilter);
    if (filtered.length > 0) return filtered;
    return tree;
  }
  return tree;
}

function buildCategoryTree(flat: Category[]): Category[] {
  const byId = new Map<number, Category>();
  flat.forEach((c) => byId.set(c.id, { ...c, children: [] }));
  const roots: Category[] = [];

  flat.forEach((c) => {
    const node = byId.get(c.id)!;
    if (c.parent_id == null) {
      roots.push(node);
    } else {
      const parent = byId.get(c.parent_id);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }
  });

  roots.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  roots.forEach((r) =>
    (r.children || []).sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
    ),
  );
  return roots;
}
