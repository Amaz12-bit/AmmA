import { useTranslation } from "@/i18n";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface ActionCardProps {
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  title: string;
  description: string;
  link: string;
  linkText: string;
}

const ActionCard = ({
  icon,
  iconBgColor,
  iconColor,
  title,
  description,
  link,
  linkText,
}: ActionCardProps) => {
  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-center mb-4">
          <div className={`h-10 w-10 rounded-full ${iconBgColor} flex items-center justify-center`}>
            <div className={iconColor}>{icon}</div>
          </div>
          <h3 className="ml-3 text-lg font-medium text-neutral-800">{title}</h3>
        </div>
        <p className="text-sm text-neutral-600">{description}</p>
      </CardContent>
      <CardFooter className="bg-neutral-50 px-5 py-3">
        <Link href={link}>
          <a className="text-sm font-medium text-primary hover:text-primary-800 flex items-center">
            {linkText}
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ActionCard;
