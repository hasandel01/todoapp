import React from 'react';

const CustomInput = React.forwardRef<HTMLButtonElement, any>((props, ref) => {
  return (
    <button 
      type="button" 
      onClick={props.onClick} 
      ref={ref}
      style={{ display: 'none' }}
    >
      {props.value}
    </button>
  );
});

export default CustomInput;
