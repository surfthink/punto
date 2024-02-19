"use client"
import { createRoom, getUsernameCookie } from "@/app/_actions/room";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormButton from "../FormButton";
import { useFormState } from "react-dom";


export default function CreateRoomCard({username}:{username:string}) {

  const [formState,formAction] = useFormState(createRoom,{success:true,message:""})
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Room</CardTitle>
        <CardDescription>Create a room to play with friends.</CardDescription>
      </CardHeader>
      <form action={formAction} className="space-y-2">
        <CardContent className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input
            name="username"
            placeholder="Username"
            required
            defaultValue={username}
          ></Input>
          {formState.success && <CardDescription>{formState.message}</CardDescription>}
          {formState.message !== "" && !formState.success && <CardDescription className="text-red-400">{formState.message}</CardDescription>}
          <Label htmlFor="roomType">Privacy</Label>
          <Select name="roomType" defaultValue="public">
            <SelectTrigger>
              <SelectValue defaultValue="public"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter>
          <FormButton type="submit">Create</FormButton>
        </CardFooter>
      </form>
    </Card>
  );
}
