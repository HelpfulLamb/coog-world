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
                    entertainment... Not to mention, delicious food found at our on-site restaurants! The park is open to anyone that wants to stop by and have fun while also 
                    supporting higher education. We invite all students to grab their friends and family and take them to our 
                    park of lasting memories!
                </p>
            </div>

            <div className="developer-section">
                <h3 className="section-title">Meet the esteemed CoogWorld Developers!</h3>
                <div className="developer-cards">
                <div className="dev-row">
                    <div className="dev-card"><h4>Brennan Green</h4><p>Computer Science</p><em>University of Houston</em></div>
                    <div className="dev-card"><h4>Bryant Truong</h4><p>Computer Science</p><em>University of Houston</em></div>
                    <div className="dev-card"><h4>David Morillon</h4><p>Computer Science</p><em>University of Houston</em></div>
                </div>
                <div className="dev-row">
                    <div className="dev-card"><h4>Elizabeth Chan</h4><p>Computer Science</p><em>University of Houston</em></div>
                    <div className="dev-card"><h4>Erin Sebastian</h4><p>Computer Science</p><em>University of Houston</em></div>
                </div>
                </div>

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
