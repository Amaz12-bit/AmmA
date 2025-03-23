import { useTranslation } from "@/i18n";
import { Link } from "wouter";

const AppFooter = () => {
  const { t, language, changeLanguage } = useTranslation();

  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center md:justify-start space-x-6">
          <Link href="/terms" className="text-sm text-neutral-500 hover:text-neutral-600">
            {t("footer.terms")}
          </Link>
          <Link href="/privacy" className="text-sm text-neutral-500 hover:text-neutral-600">
            {t("footer.privacy")}
          </Link>
          <Link href="/help" className="text-sm text-neutral-500 hover:text-neutral-600">
            {t("footer.helpCenter")}
          </Link>
        </div>
        <div className="mt-4 md:mt-0">
          <p className="text-center text-sm text-neutral-500">
            © 2025 All rights reserved
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2 justify-center md:justify-end">
          <button
            className={`text-sm ${
              language === "en"
                ? "text-neutral-700 font-medium"
                : "text-neutral-500 hover:text-neutral-700"
            } focus:outline-none`}
            onClick={() => changeLanguage("en")}
          >
            English
          </button>
          <span className="text-neutral-300">/</span>
          <button
            className={`text-sm ${
              language === "sw"
                ? "text-neutral-700 font-medium"
                : "text-neutral-500 hover:text-neutral-700"
            } focus:outline-none`}
            onClick={() => changeLanguage("sw")}
          >
            Kiswahili
          </button>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
