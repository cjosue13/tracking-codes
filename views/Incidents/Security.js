import React from 'react';
import { useState } from 'react';
import Camera from './Camera';
import Register, { formIncident } from './Register';
import PropTypes from 'prop-types';

const Security = ({ navigation }) => {
  const [register, setRegister] = useState(true);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState(formIncident);
  return (
    <>
      {register ? (
        <Register
          setRegister={setRegister}
          images={images}
          setImages={setImages}
          formData={formData}
          setFormData={setFormData}
          navigation={navigation}
        />
      ) : (
        <Camera setRegister={setRegister} images={images} setImages={setImages} />
      )}
    </>
  );
};

Security.propTypes = {
  navigation: PropTypes.object,
};

export default Security;
