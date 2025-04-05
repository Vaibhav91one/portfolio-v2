import React from 'react'
import Magnetic from './ui/Magnetic'

type Props = {}

const NavigationBar = (props: Props) => {
  return (
    <>
    <nav className='absolute z-10 w-full flex justify-start items-center text-xl my-5 px-5 text-white'>
        <div className="flex justify-start items-center
        ">
            <p>©</p>
            <div className='flex justify-center items-center gap-2'  >
                <p >Code by </p>
                <p >Vaibhav</p>
                <p >Tomar</p>
            </div>
        </div>
        <div className='flex justify-end flex-1 items-center gap-15'  >
            <Magnetic>
                <div >
                    <a>Work</a>
                    <div></div>
                </div>
            </Magnetic>
            <Magnetic>
                <div >
                    <a>About</a>
                    <div ></div>
                </div>
            </Magnetic>
            <Magnetic>
                <div>
                    <a>Contact</a>
                    <div></div>
                </div>
            </Magnetic>
        </div>
    </nav>
    </>
  )
}

export default NavigationBar