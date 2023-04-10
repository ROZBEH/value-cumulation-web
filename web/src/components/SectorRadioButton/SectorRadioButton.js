import * as React from 'react'

// import theme from '@material-tailwind/react/theme'
import Box from '@mui/joy/Box'
import Radio from '@mui/joy/Radio'
import RadioGroup from '@mui/joy/RadioGroup'
import Sheet from '@mui/joy/Sheet'
import { useRecoilValue, useRecoilState } from 'recoil'

import {
  valueTicker as valueTickerAtom,
  sectorComp as sectorCompAtom,
  calledCompanies as calledCompaniesAtom,
} from 'src/recoil/atoms'
export const SectorRadioButton = () => {
  const valueTicker = useRecoilValue(valueTickerAtom)
  const [value, setValue] = React.useState(valueTicker[0].symbol)
  const [sectorComp, setSectorComp] = useRecoilState(sectorCompAtom)
  const calledCompanies = useRecoilValue(calledCompaniesAtom)

  React.useEffect(() => {
    if (sectorComp === '') setSectorComp(valueTicker[0].symbol)
  }, [sectorComp, valueTicker, setSectorComp])
  return (
    <Box sx={{ width: 300 }}>
      {/* <FormLabel
        id="storage-label"
        sx={{
          mb: 2,
          fontWeight: 'xl',
          textTransform: 'uppercase',
          fontSize: 'xs',
          letterSpacing: '0.15rem',
        }}
      >
        Available Companies
      </FormLabel> */}
      <RadioGroup
        aria-labelledby="storage-label"
        defaultValue={value}
        value={value}
        size="lg"
        sx={{ gap: 1.5, flexDirection: 'row' }}
        onChange={(event) => {
          setSectorComp(event.target.value)
          setValue(event.target.value)
        }}
      >
        {calledCompanies
          .filter((item) => item != '')
          .map((value) => (
            <Sheet
              key={value.name}
              sx={{
                p: 2,
                borderRadius: 'md',
                boxShadow: 'sm',
                bgcolor: 'background.body',
              }}
            >
              <Radio
                label={`${value.name}`}
                overlay
                disableIcon
                value={value.symbol}
                slotProps={{
                  label: ({ checked }) => ({
                    sx: {
                      fontWeight: 'lg',
                      fontSize: 'md',
                      color: checked ? 'text.primary' : 'text.secondary',
                    },
                  }),
                  action: ({ checked }) => ({
                    sx: (_theme) => ({
                      ...(checked && {
                        '--variant-borderWidth': '2px',
                        '&&': {
                          // && to increase the specificity to win the base :hover styles
                          borderColor: 'rgb(134 239 172)',
                          // borderColor: theme.vars.palette.primary[500],
                          backgroundColor: 'rgb(134 239 172)',
                        },
                      }),
                    }),
                  }),
                }}
              />
            </Sheet>
          ))}
      </RadioGroup>
    </Box>
  )
}
