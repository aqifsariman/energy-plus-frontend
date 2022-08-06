import { Fragment } from 'react';

const InputForm = (props) => {
  return (
    <Fragment>
      <label htmlFor={props.for}>{props.children}</label>
      <input
        name={props.name}
        onChange={props.onChange}
        type={props.type}
        placeholder={props.placeholder}
      />
    </Fragment>
  );
};

export default InputForm;
