import * as React from 'react'
import styled from 'styled-components'
import { MDCCheckbox } from '@material/checkbox'
import { MDCFormField } from '@material/form-field'


const FormFieldS = styled.div`
width: 100%;
`
const LabelS = styled.label`
width: 100%;
cursor: pointer;
padding-top: 5px;
padding-bottom: 5px;
`

export function Checkbox(props: {uniqueId: string, label: string, onChange: Function, checked: boolean}) {
  const ref = React.useRef();
  const refForm = React.useRef();

  React.useEffect(() => {
    const check = new MDCCheckbox(ref.current);
    const form = new MDCFormField(ref.current);
    form.input = check;
    check.checked = props.checked;
  }, []);

  console.log("Update to: " + props.checked);
  return <>
    <FormFieldS ref={refForm} className="mdc-form-field mdc-touch-target-wrapper">
      <div ref={ref} className="mdc-checkbox mdc-checkbox--touch">
        <input type="checkbox" className="mdc-checkbox__native-control" id={props.uniqueId}
          onChange={(evt) => {props.onChange(evt)}} checked={props.checked} />
        <div className="mdc-checkbox__background">
          <svg className="mdc-checkbox__checkmark" viewBox="0 0 24 24">
            <path className="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
          </svg>
          <div className="mdc-checkbox__mixedmark"></div>
        </div>
        <div className="mdc-checkbox__ripple"></div>
        <div className="mdc-checkbox__focus-ring"></div>
      </div>
      <LabelS htmlFor={props.uniqueId}>{props.label}</LabelS>
    </FormFieldS>
  </>
}
