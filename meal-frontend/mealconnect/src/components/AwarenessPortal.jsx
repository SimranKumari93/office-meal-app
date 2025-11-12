import React, { useEffect, useState } from "react";

const slides = [
  {img:"/src/images/carousel1.png", text:"Every 5 seconds, a child dies of hunger."},
  {img:"/src/images/carousel2.png", text:"Food wasted here could feed families."},
  {img:"/src/images/carousel3.png", text:"Plan meals, reduce waste."},
  {img:"/src/images/carousel4.png", text:"Small choices save lives."},
  {img:"/src/images/carousel5.png", text:"Small choices save lives."},
  {img:"/src/images/carousel6.png", text:"Small choices save lives."},
];

export default function AwarenessCarousel(){
  const [index, setIndex] = useState(0);
  useEffect(()=> {
    const t = setInterval(()=> setIndex(i=> (i+1)%slides.length), 5000);
    return () => clearInterval(t);
  },[]);
  const s = slides[index];
  return (
    <div className="card carousel">
      <div className="carousel-img" style={{backgroundImage:`url(${s.img})`}} />
      <div className="carousel-text">{s.text}</div>
      <div className="carousel-dots">
        {slides.map((_,i)=>(<span key={i} className={`dot ${i===index?"active":""}`}></span>))}
      </div>
    </div>
  );
}
