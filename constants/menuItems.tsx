import { useFacebook } from "@/contexts/FacebookContext";
import { Columns2, House } from "lucide-react";
import { TbAutomation } from "react-icons/tb";


export const useMenuItems = () => {

    const menuItems = [
        { name: 'Home', href: '/', icon: <House className="h-5 w-5"/> },
        { name: 'Facebook Pages', href: '/dashboard/facebook-pages', icon: <Columns2 className="h-5 w-5"/> },
        { name: 'Edit Automation', href: `/dashboard/edit-automation`, icon: <TbAutomation className="h-5 w-5"/> },


    ];

    return menuItems;
}
