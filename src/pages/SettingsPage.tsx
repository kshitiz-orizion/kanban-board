import React, { useState } from 'react';
import { useIssueContext } from '../components/IssueContext';

export const SettingsPage = () => {
    const { pollInterval, setPollInterval } = useIssueContext();
    const [value, setValue] = useState<number | ''>(pollInterval);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;

        // Allow empty string (for clearing input)
        if (raw === '') {
            setValue('');
            return;
        }

        const number = parseInt(raw, 10);

        // Enforce range 1–100
        if (number >= 1 && number <= 100) {
            setValue(number);

        }
    };

    const handleSave = () => {
        setPollInterval(value)
    }

    return (
        <div className="settingsContainer">
            <label className="settingsLabel" >Enter poll Interval (in seconds)</label>
            <input
                name="pollInterval"
                type="number"
                min="1"
                max="100"
                step="1"
                placeholder="Enter a number (1–100)"
                value={value}
                onChange={handleChange}
                className='settingsInput'
            />
            <button
                onClick={handleSave}
                className='settingsSave'
            >
                Save
            </button>
        </div>
    );
};
