import React from 'react';
import './Styling.css';

function AboutUs() {
    return (
        <section className='about-section fade-in'>
            <h2 className='section-title'>About Us</h2>
            <div className='about-content'>
                <h3>What is Coog World?</h3>
                <p>
                    Coog World is a thrilling theme park owned and operated by the University of Houston, 
                    bringing the spirit of Cougars to life with exciting rides, live shows, and family-friendly 
                    entertainment. The park is open to anyone that wants to stop by and have fun while also 
                    supporting education. We encourage students to invite their friends and family to our 
                    park to create lasting memories.
                </p>
            </div>
            <div className='contact-info'>
                <h3>Contact Us:</h3>
                <div>
                    <strong>Customer Support</strong>
                    <p>Phone: <a href="tel:832-193-1940">832-193-1940</a></p>
                    <p>Email: <a href="mailto:Coogworld_support@CoogWorld.org">Coogworld_Support@CoogWorld.org</a></p>
                </div>
                <div>
                    <strong>Park Services</strong>
                    <p>Phone: <a href="tel:832-982-8274">832-982-8274</a></p>
                    <p>Email: <a href="mailto:Coogworld_service@CoogWorld.org">Coogworld_service@CoogWorld.org</a></p>
                </div>
                <div>
                    <strong>Business Inquiries</strong>
                    <p>Phone: <a href="tel:832-910-2953">832-910-2953</a></p>
                    <p>Email: <a href="mailto:Coogworld_business@CoogWorld.org">Coogworld_business@CoogWorld.org</a></p>
                </div>
            </div>
        </section>
    );
}

export default AboutUs;
