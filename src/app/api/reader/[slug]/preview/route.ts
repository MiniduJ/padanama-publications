import { NextRequest, NextResponse } from "next/server";
import { getReaderBookContent } from "@/server/reader/sample-data";
import { db } from "@/server/db";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let isEntitled = false;
    let customerName = "Guest Visitor";

    if (userId) {
      try {
        const entitlement = await db.entitlement.findFirst({
          where: {
            userId,
            isActive: true,
            book: { slug },
          },
          include: { user: true },
        });

        if (entitlement) {
          isEntitled = true;
          customerName = entitlement.user?.name || "Licensed Customer";
        }
      } catch (e) {
        // database fallback
      }
    }

    const data = getReaderBookContent(slug, {
      isEntitled,
      userIdentifier: customerName,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to load reader content" }, { status: 500 });
  }
}
