"use client";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export default function FormButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { pending } = useFormStatus();
  if (pending) return <ButtonLoading {...props}></ButtonLoading>;
  return <Button type="submit" {...props} />;
}

function ButtonLoading(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button disabled {...props}>
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> {props.children}
    </Button>
  );
}
