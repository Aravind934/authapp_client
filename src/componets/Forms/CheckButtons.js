import React from "react";
import Form from "react-bootstrap/Form";

function RadioButtons({ field, ...props }) {
    return (
        <>
            {props.options.map((option) => {
                return (
                    <Form.Check
                        {...field}
                        type={props.type}
                        key={option}
                        label={props.label ? props.label : option}
                        id={option}
                        value={option}
                        checked={field.value}
                    />
                );
            })}
        </>
    );
}

export default RadioButtons;
