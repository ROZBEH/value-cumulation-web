import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
} from '@material-tailwind/react'

export const Infopop = (inputText) => {
  return (
    <Popover placement="top">
      <PopoverHandler>
        <Button className="normal-case bg-gray-300 text-black text-sm rounded-50 h-4 w-4">
          ?
        </Button>
      </PopoverHandler>
      <PopoverContent toggle="popover" className="arrow border-2 rounded-md">
        <div className="font-bold border-b-2">Title</div>
        <div className="max-w-200px max-h-100px overflow-scroll">
          {inputText.text}
        </div>
      </PopoverContent>
    </Popover>
  )
}
