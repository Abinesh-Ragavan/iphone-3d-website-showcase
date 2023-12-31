import React from "react";
import IPhone from '../assets/images/iphone-14.jpg'
import HoldingIphone from '../assets/images/iphone-hand.png'
function Jumbotron() {

    const handleLearnMore = () => {
        const element = document.querySelector(".sound-section")
        window.scrollTo({
            top: element?.getBoundingClientRect().top,
            left: 0,
            behavior: "smooth"

        })
    }
    const handleBuyButtonClick = () => {
        window.open("https://www.apple.com/in/store", "_blank")
    };
    return (
        <div className="jumbotron-section wrapper">
            <h2 className="title">New</h2>
            <img className="logo" src={IPhone} alt="iPhone 14 pro" />
            <p className="text">Big and bigger</p>
            <span className="description">
                From $41.62/mo. for 24 mo. or $999 before trade-in
            </span>
            <ul className="links">
                <li>
                    <button className="button" onClick={handleBuyButtonClick}>Buy</button>

                </li>
                <li >
                    <a className="link" onClick={handleLearnMore} >Learn more</a>
                </li>
            </ul>
            <img className="iphone-img" src={HoldingIphone} alt="iphone" />
        </div>
    );
}

export default Jumbotron;