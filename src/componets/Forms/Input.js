import React from "react";
import Form from "react-bootstrap/Form";

function Input({ field, form: { touched, errors }, ...props }) {
    return (
        <div>
            <Form.Label>{props.label}</Form.Label>
            <Form.Control {...props} {...field} className="field" />
        </div>
    );
}

export default Input;
