import React, { useState } from 'react';

const Checkbox = ({ skill, handleClick, type, clicked}) => {
  const [toggle, setToggle] = useState(false);
  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <div>
      {clicked && ( 
        <button
          className="skill-button"
          type={type}
          style={{
            backgroundColor: 'rgb(87, 82, 212)',
            color: 'whitesmoke',
          }}
          id={skill}
          name={skill}
          onClick={() => {
            handleToggle();
            handleClick(skill);
          }}
        >
          {skill}
        </button>)}

      {!clicked && (      
        <button
          className="skill-button"
          type={type}
          style={{
            backgroundColor: '#b6b7cb',
            color: 'black',
          }}
          id={skill}
          name={skill}
          onClick={() => {
            handleToggle();
            handleClick(skill);
          }}
        >
          {skill}
        </button>)}
    </div>);
};

export default Checkbox;
