import React from "react";
import Link from "next/link";
import { RadioBoxesInput } from "~~/components/inputs/RadioBoxesInput";
import { BlockchainOptions, WrapperOptions } from "~~/constants";
import { DeedInfoModel, OtherInformationModel } from "~~/models/deed-info.model";
import { LightChangeEvent } from "~~/models/light-change-event";

interface Props {
  value?: OtherInformationModel;
  onChange?: (ev: LightChangeEvent<DeedInfoModel>) => void;
  readOnly?: boolean;
}

const OtherInformations = ({ value, onChange, readOnly }: Props) => {
  const handleChange = (ev: LightChangeEvent<OtherInformationModel>) => {
    const updatedValue = { ...value, [ev.name]: ev.value };
    onChange?.({ name: "otherInformation", value: updatedValue });
  };
  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="text-2xl font-['KronaOne'] leading-10">3. Other Information</div>
      <div>
        <div className="justify-start items-center inline-flex mt-3">
          <div className="text-base font-bold font-['Montserrat'] leading-normal">
            Select your Blockchain
          </div>
          <div className="text-center text-xs font-['Inter'] leading-none ml-1">info</div>
        </div>
        <div>
          <Link
            className="link link-accent"
            href="https://docs.deedprotocol.org/general-information/overview"
            target="_blank"
          >
            Learn more
          </Link>
          &nbsp;about the Blockchain.
        </div>
        <RadioBoxesInput
          name="blockchain"
          options={BlockchainOptions}
          optionsClassName="w-[180px] h-[220px]"
          value={value?.blockchain}
          onChange={handleChange}
          readOnly={readOnly}
        />
      </div>
      <div>
        <div className="justify-start items-center inline-flex mt-3">
          <div className="text-base font-bold font-['Montserrat'] leading-normal">
            Advanced settings
          </div>
        </div>
        <div className="justify-start items-center inline-flex mt-3">
          <div className="text-base font-bold font-['Montserrat'] leading-normal">
            Customize your Wrapper type
          </div>
        </div>
        <div>
          <Link
            className="link link-accent"
            href="https://docs.deedprotocol.org/legal-framework/property-wrappers"
            target="_blank"
          >
            Learn more
          </Link>
          &nbsp;about each Wrapper type.
        </div>
        <RadioBoxesInput
          name="wrapper"
          options={WrapperOptions}
          optionsClassName="w-full"
          value={value?.wrapper}
          onChange={handleChange}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default OtherInformations;
