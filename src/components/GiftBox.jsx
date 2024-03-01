import Modal from 'react-modal';
import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from "react";
import { Loader } from "../components";
import { Html } from '@react-three/drei';
import { Dimsum, Shark } from "../models";

const ObjModal = ({ isOpen, onRequestClose }) => {
  const [buttonText, setButtonText] = useState('Eat now');
  const [showText, setShowText] = useState(false);

  const adjustDimsumForScreenSize = () => {
    let screenScale, screenPosition;

    screenScale = [30, 30, 30];

    if (window.innerWidth < 768) {
      screenPosition = [-0.7, 0.6, -1.3];
    } else {
      screenPosition = [-0.7, 0.5, -1.3];
    }
  
    return [screenScale, screenPosition];
  };

  const adjustSharkForScreenSize = () => {
    let screenScale, screenPosition;
  
    screenScale = [1, 1, 1];
    screenPosition = [0.8, -0.7, 2.9];
  
    return [screenScale, screenPosition];
  };

  const [dimsumScale, dimsumPosition] = adjustDimsumForScreenSize();
  const [sharkScale, sharkPosition] = adjustSharkForScreenSize();

  const handleButtonClick = () => {
    if (buttonText === 'Eat now') {
      setButtonText('Adopt now');
    } else if (buttonText === 'Adopt now') {
      setButtonText('Okay');
      setShowText(true);
    } else if (buttonText === 'Okay') {
      setShowText(false);
      setButtonText('Eat now');
      onRequestClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} overlayClassName="Overlay" className="modal">
      <div className="modal-content glowing-div">     
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 75,
            near: 0.1,
            far: 1000,
          }}
        >
          <directionalLight position={[0, 0, 1]} intensity={4} />
          <ambientLight intensity={1.5} />
          <pointLight position={[5, 10, 0]} intensity={2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
          />

          <Suspense fallback={<Loader />}>
            {showText ? (
              <Html position={[0, 0, 0]}>
                <div className='-mt-20 -ml-40 w-80 px-3'>
                  <div>
                    <h1 class="text-teal-50 font-poppins text-2 font-bold text-center mb-4">Happy Birthday Yuhong!</h1>
                    <p class="text-teal-50 font-poppins text-sm text-center mb-6">Wishing you a day as rare and wonderful as you are! Here's to a year of joy and endless possibilities! 🌟🥳 <br />~ Gracie (02.29.24)</p>
                  </div>
                </div>

              </Html>
            ) : buttonText === 'Adopt now' ? (
              <Shark 
                position={sharkPosition}
                rotation={[-0.2, 0.7, 0.3]}
                scale={sharkScale}
              />
            ) : (
              <Dimsum 
                position={dimsumPosition}
                rotation={[0.5, 4.5, 0]}
                scale={dimsumScale}
              />
            )}
          </Suspense>
        </Canvas>
        <button onClick={handleButtonClick} className='neo-brutalism-white neo-btn'>{buttonText}</button>
      </div>
    </Modal>
  );
};

const GiftBox = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      {modalIsOpen ? null : (
        <div className='info-box'>
          <p className='font-medium sm:text-xl text-center'>
            A mystery awaits! Will you unlock the secret within this gift box, or leave it to gather virtual dust?
          </p>
          <button onClick={handleOpenModal} className='neo-brutalism-white neo-btn'>
            Open it
          </button>
        </div>
      )}
      <ObjModal isOpen={modalIsOpen} onRequestClose={handleCloseModal} />
    </>
  );
};

export default GiftBox;
