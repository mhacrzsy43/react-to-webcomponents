import { FC } from "react";

type HelloProps = {
  name: string;
};

const HelloApp: FC<HelloProps> = ({ name }) => {
  console.log(name, "what's the name");
  return <h1>Hello, {name}!</h1>;
};

export default HelloApp;
