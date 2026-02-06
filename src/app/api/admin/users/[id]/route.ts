import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Нэвтэрч орно уу" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Зөвхөн админ хандах эрхтэй" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const userId = typeof id === "string" ? id.trim() : "";
    if (!userId) {
      return NextResponse.json(
        { error: "Хэрэглэгчийн ID шаардлагатай" },
        { status: 400 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const { role } = body;

    if (role !== "user" && role !== "admin") {
      return NextResponse.json(
        { error: "role нь user эсвэл admin байх ёстой" },
        { status: 400 },
      );
    }

    if (userId === user.id && role === "user") {
      return NextResponse.json(
        { error: "Өөрийн админ эрхийг хасах боломжгүй" },
        { status: 400 },
      );
    }

    // Prefer authenticated client + RLS so "Profiles: admin update" allows the update
    const { data: updated, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)
      .select("id, full_name, role")
      .single();

    if (error) {
      // Fallback: try with service role (e.g. if RLS blocks or env expects it)
      try {
        const adminClient = createAdminClient();
        const { data: adminUpdated, error: adminError } = await adminClient
          .from("profiles")
          .update({ role })
          .eq("id", userId)
          .select("id, full_name, role")
          .single();

        if (adminError) {
          console.error("Error updating user role (admin client):", adminError);
          return NextResponse.json(
            { error: "Эрх шинэчлэхэд алдаа гарлаа" },
            { status: 500 },
          );
        }
        return NextResponse.json(adminUpdated);
      } catch (adminErr) {
        console.error("Admin client fallback failed:", adminErr);
      }
      console.error("Error updating user role:", error);
      return NextResponse.json(
        { error: "Эрх шинэчлэхэд алдаа гарлаа" },
        { status: 500 },
      );
    }

    return NextResponse.json(updated);
  } catch (e) {
    console.error("Error in PATCH /api/admin/users/[id]:", e);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
