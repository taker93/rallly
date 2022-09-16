import { useTranslation } from "next-i18next";

import { useModalContext } from "../modal/modal-provider";
import { usePoll } from "../poll-context";
import { useDeleteParticipantMutation } from "./mutations";

export const useDeleteParticipantModal = () => {
  const { render } = useModalContext();
  const { t } = useTranslation("app");

  const deleteParticipant = useDeleteParticipantMutation();
  const { poll } = usePoll();

  return (participantId: string) => {
    return render({
      title: t("deleteParticipant"),
      description: t("deleteParticipantDescription"),
      okButtonProps: {
        type: "danger",
      },
      okText: t("delete"),
      onOk: () => {
        deleteParticipant.mutate({
          pollId: poll.id,
          participantId,
        });
      },
      cancelText:  t("cancel"),
    });
  };
};
