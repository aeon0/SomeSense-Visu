import * as React from 'react'
import styled from 'styled-components'
import { Select } from '@rmwc/select'
import { useDispatch, useSelector } from 'react-redux'
import { setPerspective } from '../redux/perspective/actions'
import { EPerspectiveTypes } from "../redux/perspective/reducer"
import { ApplicationState } from '../redux/store'


const SelectS = styled(Select)`
  position: relative;
  float: right;
  margin-right: 25px;
  margin-top: 25px;
  pointer-events: auto;
`

export function SelectPerspective() {
  const dispatch = useDispatch();
  const perspective = useSelector((store: ApplicationState) => store.perspective.type);
  const perspectiveOptions: string[] = Object.entries(EPerspectiveTypes).map(entry => entry[1]);

  return <React.Fragment>
    <SelectS
      label="Perspective"
      enhanced
      value={perspective}
      onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => dispatch(setPerspective(evt.target.value as EPerspectiveTypes))}
      options={perspectiveOptions}
    />
  </React.Fragment>
}
