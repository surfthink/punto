import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getUsernameCookieOrUndefined,
  setUsernameCookie,
  setUsernameCookieRevalidateRoom,
} from "@/app/_actions/room";
import React, { useEffect, useState } from "react";

export function SetUsernameDialog(props: {
  roomId: string;
  onChange: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      if (!(await getUsernameCookieOrUndefined())) {
        setOpen(true);
      }
    })();
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const username = (e.target as HTMLFormElement).username.value;
    if (!username) return;
    await setUsernameCookie(username);
    setOpen(false);
    props.onChange();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set your username</DialogTitle>
          <DialogDescription>
            You must do this before joining the room.
          </DialogDescription>
          <form onSubmit={handleSubmit} className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input name="username" required></Input>
            <DialogFooter>
              <Button type="submit">Save Username</Button>
            </DialogFooter>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
