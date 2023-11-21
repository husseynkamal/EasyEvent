import React from "react";

import Input from "../../../FormElements/Input";
import {
  VALIDATOR_MIN,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../../../util/validators";

const ModalForm = ({ inputHandler, initialFormValues }) => {
  return (
    <form>
      <Input
        id="title"
        type="text"
        label="Title"
        element="input"
        placeholder="Enter your event title"
        errorText="Please enter an event title."
        onInput={inputHandler}
        validators={[VALIDATOR_REQUIRE()]}
        initialValue={initialFormValues?.inputs?.title?.value}
        initialValidity={initialFormValues?.inputs?.title?.isValid}
      />
      <Input
        id="price"
        type="number"
        label="Price"
        element="input"
        placeholder="Enter your event price"
        errorText="Event price should be at least $50."
        onInput={inputHandler}
        validators={[VALIDATOR_MIN(50)]}
        initialValue={initialFormValues?.inputs?.price?.value}
        initialValidity={initialFormValues?.inputs?.price?.isValid}
      />
      <Input
        id="date"
        type="datetime-local"
        label="Date"
        element="input"
        placeholder="Enter your event date"
        errorText="Event date should not be empty."
        onInput={inputHandler}
        validators={[VALIDATOR_REQUIRE()]}
        initialValue={initialFormValues?.inputs?.date?.value}
        initialValidity={initialFormValues?.inputs?.date?.isValid}
      />
      <Input
        id="description"
        type="text"
        label="Description"
        element="textarea"
        placeholder="Enter your event description"
        errorText="Event description should be at least 6 characters."
        onInput={inputHandler}
        validators={[VALIDATOR_MINLENGTH(6)]}
        initialValue={initialFormValues?.inputs?.description?.value}
        initialValidity={initialFormValues?.inputs?.description?.isValid}
      />
    </form>
  );
};

export default ModalForm;
