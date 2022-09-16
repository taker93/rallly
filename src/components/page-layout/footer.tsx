import Link from "next/link";
import { useRouter } from "next/router";
import { Trans, useTranslation } from "next-i18next";
import * as React from "react";

import Discord from "@/components/icons/discord.svg";
import Star from "@/components/icons/star.svg";
import Translate from "@/components/icons/translate.svg";
import Twitter from "@/components/icons/twitter.svg";
import DigitalOcean from "~/public/digitalocean.svg";
import Logo from "~/public/logo.svg";
import Sentry from "~/public/sentry.svg";
import Vercel from "~/public/vercel-logotype-dark.svg";

import { LanguageSelect } from "../poll/language-selector";

const Footer: React.VoidFunctionComponent = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  return (
    <div className="mt-16 bg-gradient-to-b from-gray-50/0 via-gray-50 to-gray-50 ">
      <div className="mx-auto max-w-7xl space-y-8 p-8 lg:flex lg:space-x-16 lg:space-y-0">
        <div className=" lg:w-5/6">
          <Logo className="w-32 text-slate-400" />
          <div className="mb-8 mt-4 text-slate-400">
            <div>
              <div>
                <Trans
                  t={t}
                  i18nKey="footerCreditVella"
                  components={{
                    a: (
                      <a
                        className="font-normal leading-loose text-slate-400 underline hover:text-slate-800 hover:underline"
                        href="https://twitter.com/imlukevella"
                      />
                    ),
                  }}
                />
              </div>
              <div>
                <Trans
                  t={t}
                  i18nKey="footerCreditKurz"
                  components={{
                    a: (
                      <a
                        className="font-normal leading-loose text-slate-400 underline hover:text-slate-800 hover:underline"
                        href="https://nur-kurz.de/"
                      />
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/6">
          <div className="mb-4 font-medium">{t("language")}</div>
          <LanguageSelect
            className="mb-4 w-full"
            onChange={(locale) => {
              router.push(router.asPath, router.asPath, { locale });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
