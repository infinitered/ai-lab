import React from 'react';

export const Devices = props => {
  const devices = props.devices;
  const optionItems =
    devices &&
    devices.map(device => (
      <option key={device.deviceId} value={device.deviceId}>
        {device.label}
      </option>
    ));

  return (
    <div>
      <select
        onChange={event => props.onChange(event.target.value)}
        value={props.select}
      >
        <option disabled={!!props.select} value={'None'}>
          Choose a Camera
        </option>
        {optionItems}
      </select>
    </div>
  );
};
