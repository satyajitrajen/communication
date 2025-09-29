import { useWebsiteSettings } from "../../store/api/useWebsiteSettings";

const Footer = () => {
  let { data: websiteSettings } = useWebsiteSettings();

  return (
    <div className="dark:text-white-dark text-center ltr:sm:text-left rtl:sm:text-right p-6 pt-0 mt-auto">
      {websiteSettings?.settings ? websiteSettings.settings[0].website_name : ""} - Admin
    </div>
  );
};

export default Footer;
