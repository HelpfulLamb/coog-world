import React from 'react';
import strollerImg from '../images/Stroller_icon.jpg';
import wheelchairImg from '../images/Wheelchair_icon.jpg';
import lockerImg from '../images/Locker_icon.jpg';
import './Styling.css';

function Services() {
    return(
        <section className='services-section slide-in'>
            <h2 className='section-title'>Our Services</h2>
            <p className='section-sub'>
                We offer various in-park services to fit your needs while you visit our park to make your experience as hassle free as possible. 
                These services can be purchased at the service center near the entrance of the park. Below are the services we provide.
            </p>
            <div className='services-grid'>
                <div className='service-card'>
                    <img src={strollerImg} alt="Stroller" className='service-icon' draggable="false" />
                    <h3>Strollers</h3>
                    <p>One day: $18</p>
                </div>
                <div className='service-card'>
                    <img src={wheelchairImg} alt="Wheelchair" className='service-icon' draggable="false" />
                    <h3>Wheelchairs</h3>
                    <p>One day: $12</p>
                </div>
                <div className='service-card'>
                    <img src={lockerImg} alt="Locker" className='service-icon' draggable="false" />
                    <h3>Lockers</h3>
                    <p>One day: $12, Bi-hourly Rate: $2</p>
                    <small>Size: 12" x 13" x 16.9"<br /><strong>Notice: </strong>Unclaimed items that remain inside a locker past park closing time will be stored at the service center front desk.</small>
                </div>
            </div>
            <div className='free-services'>
                <h2>Free Services</h2>
                <ul>
                    <li>First Aid</li>
                    <li>Wi-Fi Access</li>
                </ul>
            </div>
        </section>
    );
}

export default Services;
