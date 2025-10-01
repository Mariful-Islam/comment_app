"use client"
import { Button } from "@/components/ui/button";
import { withAuth } from "@/hoc/withAuth";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.refresh()
    router.replace('/login')
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <div>Dashboard</div>
      <Button onClick={handleLogout}> 
        Logout
      </Button>
    </div>
  );
}


export default withAuth(Home)