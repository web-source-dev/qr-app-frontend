import React, { useContext, useState, useEffect } from 'react';
import { GlobalConfigContext } from './globalconfig';
import './configuration.css'

const Configuration = () => {
    const { globalConfig, updateGlobalConfig } = useContext(GlobalConfigContext);

    const handleChange = (field, value) => {
        if (field === 'scanLimit') {
            updateGlobalConfig({ scanLimit: value });
        } else if (field === 'since' || field === 'until') {
            updateGlobalConfig({
                timeScheduling: { ...globalConfig.timeScheduling, [field]: value },
            });
        } else if (field === 'password') {
            updateGlobalConfig({ password: value });
        }
    };

    const [openSections, setOpenSections] = useState({}); // Track open/closed states
    const [enabledFields, setEnabledFields] = useState({
        timeScheduling: false,
        scanLimit: false,
        password: false,
    }); // Track enable/disable states
    useEffect(() => {
        // Set the initial state of scanLimit checkbox based on active_scan_limit from backend
        if (globalConfig.active_scan_limit) {
            setEnabledFields((prev) => ({
                ...prev,
                scanLimit: true,
            }));
        }
        if (globalConfig.active_password){
            setEnabledFields((prev) => ({
                ...prev,
                password: true,
            }));
        }
        if (globalConfig.active_time_scheduling){
            setEnabledFields((prev) => ({
                ...prev,
                timeScheduling: true,
            }));
        }
    }, [globalConfig.active_scan_limit]);

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleToggle = (section) => {
        setEnabledFields((prev) => {
            const updatedFields = {
                ...prev,
                [section]: !prev[section],
            };

            // Clear specific data when unchecked
            if (section === 'timeScheduling' && !updatedFields.timeScheduling) {
                updateGlobalConfig({
                    timeScheduling: { since: '', until: '' },
                });
            } else if (section === 'scanLimit' && !updatedFields.scanLimit) {
                updateGlobalConfig({
                    scanLimit: 0,
                });
            } else if (section === 'password' && !updatedFields.password) {
                updateGlobalConfig({
                    password: '',
                });
            }

            // Update the global config without causing re-renders
            if (section === 'timeScheduling') {
                updateGlobalConfig({
                    active_time_scheduling: updatedFields.timeScheduling,
                });
            } else if (section === 'scanLimit') {
                updateGlobalConfig({
                    active_scan_limit: updatedFields.scanLimit,
                });
            } else if (section === 'password') {
                updateGlobalConfig({
                    active_password: updatedFields.password,
                });
            }

            return updatedFields;
        });
    };

    return (
        <>
            <div className="collapsible-section">
                <div
                    className={`collapsible-header ${openSections.configuration1 ? "opened" : ""}`}
                    onClick={() => toggleSection("configuration1")}
                >
                    <span>Time Scheduling</span>
                    <span className={`arrow ${openSections.configuration1 ? "down" : "right"}`}>
                        <i className="ri-arrow-down-fill"></i>
                    </span>
                </div>
                {openSections.configuration1 && (
                    <div className="collapsible-content">
                        <div className="configuration-time-scheduling">
                            <div className="toggle-switchs">
                                <input
                                    type="checkbox"
                                    id="timeSchedulingToggle"
                                    checked={enabledFields.timeScheduling}
                                    onChange={() => handleToggle('timeScheduling')}
                                />
                                <label htmlFor="timeSchedulingToggle" className="switch"></label>
                            </div>
                            <div className="date-inputs">
                                <div>
                                    <label>Since:</label>
                                    <input
                                        type="date"
                                        value={globalConfig.timeScheduling.since}
                                        onChange={(e) => handleChange('since', e.target.value)}
                                        disabled={!enabledFields.timeScheduling}
                                    />
                                </div>
                                <div>
                                    <label>Until:</label>
                                    <input
                                        type="date"
                                        value={globalConfig.timeScheduling.until}
                                        onChange={(e) => handleChange('until', e.target.value)}
                                        disabled={!enabledFields.timeScheduling}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            <div className="collapsible-section">
                <div
                    className={`collapsible-header ${openSections.configuration2 ? "opened" : ""}`}
                    onClick={() => toggleSection("configuration2")}
                >
                    <span>Scan Limit</span>
                    <span className={`arrow ${openSections.configuration2 ? "down" : "right"}`}>
                        <i className="ri-arrow-down-fill"></i>
                    </span>
                </div>
                {openSections.configuration2 && (
                    <div className="collapsible-content">
                        <div className="toggle-switchs">
                            <input
                                type="checkbox"
                                id="timeScanlimitToggle"
                                checked={enabledFields.scanLimit}
                                onChange={() => handleToggle('scanLimit')}
                            />
                            <label htmlFor="timeScanlimitToggle" className="switch"></label>
                        </div>

                        <div className="configuration-scan-limit">
                            <label>Scan Limit:</label>
                            <input
                                type="number"
                                value={globalConfig.scanLimit}
                                onChange={(e) => handleChange('scanLimit', e.target.value)}
                                disabled={!enabledFields.scanLimit}
                            />
                        </div>

                    </div>
                )}
            </div>

            <div className="collapsible-section">
                <div
                    className={`collapsible-header ${openSections.configuration3 ? "opened" : ""}`}
                    onClick={() => toggleSection("configuration3")}
                >
                    <span>Set Password</span>
                    <span className={`arrow ${openSections.configuration3 ? "down" : "right"}`}>
                        <i className="ri-arrow-down-fill"></i>
                    </span>
                </div>
                {openSections.configuration3 && (
                    <div className="collapsible-content">
                        
                        <div className="toggle-switchs">
                            <input
                                id="passwordToggle"
                                type="checkbox"
                                checked={enabledFields.password}
                                onChange={() => handleToggle('password')}
                            />
                            <label htmlFor="passwordToggle" className="switch"></label>
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type="text"
                                value={globalConfig.password || globalConfig.qrPassword}
                                onChange={(e) => handleChange('password', e.target.value)}
                                disabled={!enabledFields.password}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Configuration;
