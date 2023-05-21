import * as React from 'react';

const story = {
    quote: "",
    name: "",
    subtitle:"",
}

export interface IStoryProps {
}

export function Story (props: IStoryProps) {
  return (
    <div
    className="min-h-[50vh] w-screen md:w-auto flex flex-col text-center
  max-w-7xl py-20 px-3 md:px-32 mx-auto items-center justify-center"
  >
    <h3 className="mb-10 text-3xl font-bold text-violet-800">User Story</h3>
    <div className='grid md:grid-cols-2 gap-5 px-2'>
        <div>
          
        </div>
    </div>
    </div>
  );
}
