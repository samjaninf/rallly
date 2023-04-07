import { VoteType } from "@rallly/database";
import clsx from "clsx";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/button";
import VoteIcon from "@/components/poll/vote-icon";
import {
  useCurrentPollOptions,
  useDateFormatter,
} from "@/ui/contexts/current-event";

export type AvailabilityFormData = {
  data: { optionId: string; type?: VoteType }[];
};

export function AvailabilityForm(props: {
  className?: string;
  formId: string;
  defaultValues?: AvailabilityFormData;
  submitText?: string;
  onSubmit: (data: AvailabilityFormData) => void;
}) {
  const { control, handleSubmit } = useForm<AvailabilityFormData>({
    defaultValues: props.defaultValues,
  });
  const { fields, update } = useFieldArray({
    control,
    name: "data",
  });
  const { data: options = [] } = useCurrentPollOptions();

  const formatDate = useDateFormatter();

  const updateHandler = React.useCallback(
    (index: number, vote: VoteType) => {
      update(index, { optionId: fields[index].optionId, type: vote });
    },
    [fields, update],
  );
  return (
    <form
      id={props.formId}
      className={clsx(props.className)}
      onSubmit={handleSubmit(props.onSubmit)}
    >
      <div className="grow space-y-4">
        <div>
          <h2 className="font-semibold">Please choose</h2>
          <div className="text-slate-500">
            Choose your preferred times from the list below
          </div>
        </div>
        <div className="space-y-4">
          {fields.map((field, index) => {
            return (
              <div
                className={clsx(
                  "flex select-none items-center gap-4 rounded border p-2 hover:bg-slate-50 active:bg-slate-100",
                )}
                key={field.optionId}
                onClick={() => {
                  updateHandler(
                    index,
                    field.type === "yes"
                      ? "ifNeedBe"
                      : field.type === "ifNeedBe"
                      ? "no"
                      : "yes",
                  );
                }}
              >
                <div>
                  <VoteIcon type={field.type} />
                </div>
                <div className="font-semibold">
                  {formatDate(options[index].start, "LL LT")}
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <Button type="primary" htmlType="submit">
            {props.submitText}
          </Button>
        </div>
      </div>
    </form>
  );
}
