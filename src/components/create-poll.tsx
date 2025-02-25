import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { usePlausible } from "next-plausible";
import React from "react";
import { useSessionStorage } from "react-use";

import { encodeDateOption } from "../utils/date-time-utils";
import { trpc } from "../utils/trpc";
import { Button } from "./button";
import {
  NewEventData,
  PollDetailsData,
  PollDetailsForm,
  PollOptionsData,
  PollOptionsForm,
  UserDetailsData,
  UserDetailsForm,
} from "./forms";
import { SessionProps, useSession, withSession } from "./session";
import StandardLayout from "./standard-layout";
import Steps from "./steps";

type StepName = "eventDetails" | "options" | "userDetails";

const steps: StepName[] = ["eventDetails", "options", "userDetails"];

const required = <T,>(v: T | undefined): T => {
  if (!v) {
    throw new Error("Required value is missing");
  }

  return v;
};

const initialNewEventData: NewEventData = { currentStep: 0 };
const sessionStorageKey = "newEventFormData";

export interface CreatePollPageProps extends SessionProps {
  title?: string;
  location?: string;
  description?: string;
  maxVotes?: number;
  view?: "week" | "month";
}

const Page: NextPage<CreatePollPageProps> = ({
  title,
  location,
  description,
  maxVotes,
  view,
}) => {
  const { t } = useTranslation("app");

  const router = useRouter();

  const session = useSession();

  const [persistedFormData, setPersistedFormData] =
    useSessionStorage<NewEventData>(sessionStorageKey, {
      currentStep: 0,
      eventDetails: {
        title,
        location,
        description,
        maxVotes,
      },
      options: {
        view,
      },
      userDetails:
        session.user?.isGuest === false
          ? {
            name: session.user.name,
            contact: session.user.email,
          }
          : undefined,
    });

  const [formData, setTransientFormData] = React.useState(persistedFormData);

  const setFormData = React.useCallback(
    (newEventData: NewEventData) => {
      setTransientFormData(newEventData);
      setPersistedFormData(newEventData);
    },
    [setPersistedFormData],
  );

  const currentStepIndex = formData?.currentStep ?? 0;

  const currentStepName = steps[currentStepIndex];

  const [isRedirecting, setIsRedirecting] = React.useState(false);

  const plausible = usePlausible();

  const createPoll = trpc.useMutation(["polls.create"], {
    onSuccess: (res) => {
      setIsRedirecting(true);
      plausible("Created poll", {
        props: {
          numberOfOptions: formData.options?.options?.length,
          optionsView: formData?.options?.view,
        },
      });
      setPersistedFormData(initialNewEventData);
      router.replace(`/admin/${res.urlId}?sharing=true`);
    },
  });

  const isBusy = isRedirecting || createPoll.isLoading;

  const handleSubmit = async (
    data: PollDetailsData | PollOptionsData | UserDetailsData,
  ) => {
    if (currentStepIndex < steps.length - 1) {
      setFormData({
        ...formData,
        currentStep: currentStepIndex + 1,
        [currentStepName]: data,
      });
    } else {
      // last step
      const title = required(formData?.eventDetails?.title);

      await createPoll.mutateAsync({
        title: title,
        type: "date",
        location: formData?.eventDetails?.location,
        description: formData?.eventDetails?.description,
        maxVotes: formData?.eventDetails?.maxVotes,
        user: {
          name: required(formData?.userDetails?.name),
          email: required(formData?.userDetails?.contact),
        },
        timeZone: formData?.options?.timeZone,
        options: required(formData?.options?.options).map(encodeDateOption),
      });
    }
  };

  const handleChange = (
    data: Partial<PollDetailsData | PollOptionsData | UserDetailsData>,
  ) => {
    setFormData({
      ...formData,
      currentStep: currentStepIndex,
      [currentStepName]: data,
    });
  };

  return (
    <StandardLayout>
      <Head>
        <title>{formData?.eventDetails?.title ?? t("newPoll")}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="max-w-full py-4 md:px-3 lg:px-6">
        <div className="mx-auto w-fit max-w-full lg:mx-0">
          <div className="mb-4 flex items-center justify-center space-x-4 px-4 lg:justify-start">
            <h1 className="m-0">{t("newPoll")}</h1>
            <Steps current={currentStepIndex} total={steps.length} />
          </div>
          <div className="overflow-hidden border-t border-b bg-white shadow-sm md:rounded-lg md:border">
            {(() => {
              switch (currentStepName) {
                case "eventDetails":
                  return (
                    <PollDetailsForm
                      className="max-w-full px-4 pt-4"
                      name={currentStepName}
                      defaultValues={formData?.eventDetails}
                      onSubmit={handleSubmit}
                      onChange={handleChange}
                    />
                  );
                case "options":
                  return (
                    <PollOptionsForm
                      className="grow"
                      name={currentStepName}
                      defaultValues={formData?.options}
                      onSubmit={handleSubmit}
                      onChange={handleChange}
                      title={formData.eventDetails?.title}
                    />
                  );
                case "userDetails":
                  return (
                    <UserDetailsForm
                      className="grow px-4 pt-4"
                      name={currentStepName}
                      defaultValues={formData?.userDetails}
                      onSubmit={handleSubmit}
                      onChange={handleChange}
                    />
                  );
              }
            })()}
            <div className="flex w-full justify-end space-x-3 border-t bg-slate-50 px-4 py-3">
              {currentStepIndex > 0 ? (
                <Button
                  disabled={isBusy}
                  onClick={() => {
                    setFormData({
                      ...persistedFormData,
                      currentStep: currentStepIndex - 1,
                    });
                  }}
                >
                  {t("back")}
                </Button>
              ) : null}
              <Button
                form={currentStepName}
                loading={isBusy}
                htmlType="submit"
                type="primary"
              >
                {currentStepIndex < steps.length - 1
                  ? t("continue")
                  : t("createPoll")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
};

export default withSession(Page);
