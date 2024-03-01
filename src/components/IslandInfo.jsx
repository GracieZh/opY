import GiftBox from "./GiftBox";
import hand from './../assets/icons/hand3.png'

const IslandInfo = ({ currentStage }) => {
  if (currentStage === 1)
    return (
      <>
      <table>
        <tr>
          <img src={hand} alt='hand' className='w-10 h-10 mx-auto my-2' /> 
        </tr>
        <tr>
          <h1 className='sm:text-xl sm:leading-snug text-center neo-brutalism-blue py-4 px-8 text-white mx-5'>
            Look! A floating island! 🤩 <br />
            Swipe to look around!
          </h1>
        </tr>
        </table>
      </>
    );

  if (currentStage === 2) {
    return (
      <GiftBox />
    );
  }

  if (currentStage === 3) {
    return (
      <h1 className='sm:text-xl sm:leading-snug text-center neo-brutalism-blue py-4 px-8 text-white mx-5'>
          Here's a cake with byte-sized layers and a stack of sweetness. Blow out the candles and make a wish!<br />
      </h1>
    );
  }

  if (currentStage === 4) {
    return (
      <h1 className='sm:text-xl sm:leading-snug text-center neo-brutalism-blue py-4 px-8 text-white mx-5'>
        What's that guy doing on the hill?
      </h1>
    );
  }

  return null;
};

export default IslandInfo;
