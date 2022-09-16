import clsx from "clsx";
import { useTranslation } from "next-i18next";
import * as React from "react";
import { useForm } from "react-hook-form";

import { requiredString } from "../../utils/form-validation";
import { PollFormProps } from "./types";

export interface PollDetailsData {
  title: string;
  location: string;
  description: string;
  maxVotes: number | undefined;
}

export const PollDetailsForm: React.VoidFunctionComponent<
  PollFormProps<PollDetailsData>
> = ({ name, defaultValues, onSubmit, onChange, className }) => {
  const { t } = useTranslation("app");
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PollDetailsData>({ defaultValues });

  React.useEffect(() => {
    if (onChange) {
      const subscription = watch(onChange);
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [onChange, watch]);

  const [maxVotesEnabled, setMaxVotesEnabled] = React.useState(defaultValues?.maxVotes != undefined && defaultValues?.maxVotes >= 1);

  const handleMaxVotesChecked = () => {
    setMaxVotesEnabled(value => !value);
    setValue("maxVotes", undefined);
  }

  return (
    <form
      id={name}
      className={clsx("max-w-full", className)}
      style={{ width: 500 }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="formField">
        <label htmlFor="title">{t("title")}</label>
        <input
          type="text"
          id="title"
          className={clsx("input w-full", {
            "input-error": errors.title,
          })}
          placeholder={t("titlePlaceholder")}
          {...register("title", { validate: requiredString })}
        />
      </div>
      <div className="formField">
        <label htmlFor="location">{t("location")}</label>
        <input
          type="text"
          id="location"
          className="input w-full"
          placeholder={t("locationPlaceholder")}
          {...register("location")}
        />
      </div>
      <div className="formField">
        <label htmlFor="description">{t("description")}</label>
        <textarea
          id="description"
          className="input w-full"
          placeholder={t("descriptionPlaceholder")}
          rows={5}
          {...register("description")}
        />
      </div>
      <div className="">
        <div className="flex items-center mb-2">
          <input type="checkbox" id="maxVotesActive" onChange={handleMaxVotesChecked} className="input w-8 h-8 mr-2" checked={maxVotesEnabled} />
          <label htmlFor="description" className="mb-0">{t("maxVotes")}</label>
        </div>
        <div className="formField w-full">
          <input
            disabled={!maxVotesEnabled}
            type="number"
            id="maxVotes"
            className={clsx("input w-full", {
              "input-error": errors.maxVotes,
            })}
            placeholder={t("maxVotesPlaceholder")}
            {...register("maxVotes", { valueAsNumber: true, disabled: !maxVotesEnabled })}
          />
        </div>
      </div>
    </form>
  );
};
