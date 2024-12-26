import DashBoardLayoutProvider from "@/provider/dashboard.layout.provider";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getDictionary } from "@/app/dictionaries";
const layout = async ({ children, params: { lang } }) => {
const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
   
    redirect("/");
  }

  // console.log(session)

 
  const trans = await getDictionary(lang);
    // Extract token from the session if available
    const token = session?.accessToken || null; // Assuming the token is stored here

  return (
    <DashBoardLayoutProvider trans={trans} >{children}</DashBoardLayoutProvider>
  );
};

export default layout;
