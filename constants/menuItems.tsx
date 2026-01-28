import { useFacebook } from "@/contexts/FacebookContext";
import { Columns2, House } from "lucide-react";
import { TbAutomation } from "react-icons/tb";
import { BsInstagram } from "react-icons/bs";
import { IoAnalyticsOutline } from "react-icons/io5";
import { useInstagram } from "@/contexts/InstagramContext";
import { MdDataUsage } from "react-icons/md";
import { GoPackage } from "react-icons/go";

export const useMenuItems = () => {
    const { user: fbUser } = useFacebook();
    const { user: instaUser } = useInstagram();

    const menuItems = [
        { name: 'Home', href: '/', icon: <House className="h-5 w-5"/> },
        // { name: 'Analytics', href: '/dashboard/analytics', icon: <IoAnalyticsOutline className="h-5 w-5"/> },

        // Use the logical AND, but we will filter out the "false" results later
        fbUser && { name: 'Facebook Pages', href: '/dashboard/facebook-pages', icon: <Columns2 className="h-5 w-5"/> },

        instaUser && { name: 'Instagram Posts', href: '/dashboard/instagram/posts', icon: <BsInstagram className="h-5 w-5"/> },

        { name: 'Edit Automation', href: `/dashboard/edit-automation`, icon: <TbAutomation className="h-5 w-5"/> },
        { name: 'Keywords Usage', href: `/dashboard/keywords-usage`, icon: <MdDataUsage className="h-5 w-5"/> },
        { name: 'Package', href: `/dashboard/package`, icon: <GoPackage  className="h-5 w-5"/>}
    ].filter(Boolean); // This removes all null, undefined, or false values

    return menuItems;
}