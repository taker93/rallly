import clsx from "clsx";
import Cookies from "js-cookie";
import { useTranslation } from "next-i18next";

export const LanguageSelect: React.VoidFunctionComponent<{
  className?: string;
  onChange?: (language: string) => void;
}> = ({ className, onChange }) => {
  const { i18n } = useTranslation("common");
  return (
    <select
      className={clsx("input", className)}
      defaultValue={i18n.language}
      onChange={(e) => {
        Cookies.set("NEXT_LOCALE", e.target.value, {
          expires: 365,
        });
        onChange?.(e.target.value);
      }}
    >
      <option value="en">English</option>
      <option value="de">Deutsch</option>
    </select>
  );
};
