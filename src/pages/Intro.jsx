import { Link } from "react-router-dom";
import React from "react";
import { TypeAnimation } from 'react-type-animation';

const Part0 = () => (
  <h1 className='head-text'>
        
        <TypeAnimation
          className="text-blue-500"
          sequence={[
            'Happy leap year birthday Yuhong!',
            1000,
            '生日快乐!',
            1000,
          ]}
          wrapper="span"
          speed={40}
          repeat={Infinity}
        />
  </h1>
)

const Intro = () => {
  return (
    <section className='max-container'>
      <Part0 />

      <div className='mt-10 flex flex-col gap-3'>
          <p>
            Ready for a surprise? Click the button below.
          </p>
      </div>     
      <Link to='/island' className='mt-10 flex flex-col gap-3 cursor-pointer bg-blue-500 shadow-lg shadow-blue-500/50 rounded max-w-[100px] py-2 px-4 text-white border-none'>
        Let's go!
      </Link>
    </section>
  );
};

export default Intro;
