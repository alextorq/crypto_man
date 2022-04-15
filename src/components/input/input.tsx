import React from "react";
import './input.css'

interface Props {
    value: string;
    onChange: (value: string) => void;
    className?: string
}


export const Input: React.FC<Props> = ({ value, onChange, className }) => {
    return (
        <input
            className={'Input' + (className ? ' ' + className : '')}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
};

export default Input
