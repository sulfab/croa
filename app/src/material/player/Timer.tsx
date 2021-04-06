import {css} from '@emotion/react'
import {useNow} from '@gamepark/react-client'
import PlayerTime from '@gamepark/react-client/dist/Types/PlayerTime'
import { FunctionComponent, HTMLAttributes } from 'react';
import {humanize} from '../../utils/TimeUtil'

const Timer: FunctionComponent<{ time: PlayerTime } & HTMLAttributes<HTMLSpanElement>> = ({time, ...props }) => {
  const now = useNow()
  const availableTime = time.availableTime - now + Date.parse(time.lastChange)
  return <span { ...props } css={availableTime < 0 && timeoutStyle}>{humanize(Math.abs(availableTime))}</span>
}

const timeoutStyle = css`
  color: darkred;

  &:before {
    content: '-'
  }
`

export {
  Timer
};