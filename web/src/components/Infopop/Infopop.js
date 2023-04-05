/**
Value Cumulation
Copyright (c) 2022 Value Cumulation

Notice: All code and information in this repository is the property of Value Cumulation.
You are strictly prohibited from distributing or using this repository unless otherwise stated.
 */

import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from '@material-tailwind/react'

export const Infopop = (inputText) => {
  return (
    <Popover placement="top">
      <PopoverHandler>
        <button className="normal-case bg-gray-300 text-black text-sm rounded-50 h-4 w-4">
          ?
        </button>
      </PopoverHandler>
      <PopoverContent toggle="popover" className="arrow border-2 rounded-md">
        <div className="font-bold border-b-2">{inputText.title}</div>
        <div className="max-w-200px max-h-100px overflow-scroll">
          {inputText.text}
        </div>
      </PopoverContent>
    </Popover>
  )
}
