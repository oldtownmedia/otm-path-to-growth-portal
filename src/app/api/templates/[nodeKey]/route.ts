import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ nodeKey: string }> }
) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { nodeKey } = await params;

  const sections = await prisma.nodeTemplate.findMany({
    where: { nodeKey },
    orderBy: { sortOrder: "asc" },
  });

  if (sections.length === 0) {
    return NextResponse.json({ error: "No templates found for this node" }, { status: 404 });
  }

  return NextResponse.json({ sections });
}
