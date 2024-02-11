import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { QuestionMarkIcon } from "@radix-ui/react-icons"


export default function RulesDialog({className,width = 40,height = 40,}:{className:string,width?: number, height?: number}){
return <Dialog>
  <DialogTrigger asChild>
    <Button className={cn("aspect-square h-auto p-2 rounded rounded-lg",className)}>
      {/* <QuestionMarkCircledIcon width={width} height={height}></QuestionMarkCircledIcon> */}
      <QuestionMarkIcon width={width} height={height}></QuestionMarkIcon>
    </Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
    </DialogHeader>
      <DialogTitle className="text-3xl">How to play:</DialogTitle>
      <DialogTitle>Wait for your turn</DialogTitle>
      <DialogDescription>View the turn order at the bottom or right of your screen.</DialogDescription>
      <DialogTitle>Play your card</DialogTitle>
      <DialogDescription>
      <ul className="list-disc list-inside text-left">
    <li>Select any open space adjacent to an existing card.</li>
    <li>Select a card on the board with a lower number of dots. </li>
  </ul>
      </DialogDescription>
      <DialogTitle>The board can never be more than a 6x6 grid</DialogTitle>
      <DialogTitle>Win by getting four in a row!</DialogTitle>
      <DialogDescription>This can be horizontal, vertical, or diagonal.</DialogDescription>
    
  </DialogContent>
</Dialog>
}