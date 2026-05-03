import { Facebook } from "@/models/Facebook";
import { FacebookPage } from "@/models/FacebookPage";
import { User } from "@/models/User";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return Response.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    return Response.json(
      { success: false, error: "User not found" },
      { status: 404 },
    );
  }

  const facebook = await Facebook.findOne({ userEmail: user.email });

  const facebookPages = await FacebookPage.find({
    ownerAccessToken: facebook.accessToken,
  });

  return Response.json({ success: true, data: facebookPages });
}
