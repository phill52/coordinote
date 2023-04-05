import React from 'react';  

const LoginInput = (props) => {
  const handleChange = async(e) => {
    props.onChange(e.target.value);
	};
  const purpose = props.for;
  return (
    <div>
      <input 
      autoComplete="off"
      type={purpose}
      id={purpose}
      name={purpose}
      onChange={handleChange}
      className="login-input"
      />
    </div>
  );
};

export default LoginInput;