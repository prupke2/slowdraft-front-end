import { useState } from "react";

export default function useInput() {
  let [value, setValue] = useState("");
  let onChange = function (event) {
    setValue(event.target.value);
  };
  return {
    value,
    setValue,
    onChange,
  };
}
