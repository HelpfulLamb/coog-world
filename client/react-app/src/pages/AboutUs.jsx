import React from 'react';

function AboutUs() {
    const styles = {
        aboutUs: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.6',
            color: '#333',
        },
        header: {
            color: '#C8102E',
            borderBottom: '2px solid #C8102E',
            paddingBottom: '10px',
        },
        section: {
            marginBottom: '30px',
        },
        description: {
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '5px',
        },
        contactInfo: {
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
        },
        contactCard: {
            flex: '0 0 30%',
            backgroundColor: '#f0f0f0',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '20px',
        },
        link: {
            color: '#C8102E',
            textDecoration: 'none',
        },
        phone: {
            fontWeight: 'bold',
        },
    };

    return (
        <div className="about-us" style={styles.aboutUs}>
            <h1 style={styles.header}>About Us</h1>
            
            <section className="description" style={{...styles.section, ...styles.description}}>
                <h2>What is Coog World?</h2>
                <p>
                    Coog World is a thrilling theme park owned and operated by the University of Houston, 
                    bringing the spirit of Cougars to life with exciting rides, live shows, and family-friendly 
                    entertainment. The park is open to anyone that wants to stop by and have fun while also 
                    supporting education. We encourage students to invite their friends and family to our 
                    park to create lasting memories.
                </p>
            </section>
            
            <section className="contact" style={styles.section}>
                <h2 style={styles.header}>Contact Us</h2>
                
                <div className="contact-info" style={styles.contactInfo}>
                    <div className="contact-card" style={styles.contactCard}>
                        <h3>Customer Support</h3>
                        <p style={styles.phone}>Phone: <a href="tel:832-193-1940" style={styles.link}>832-193-1940</a></p>
                        <p>Email: <a href="mailto:Coogworld_support@uh.edu" style={styles.link}>Coogworld_support@uh.edu</a></p>
                    </div>
                    
                    <div className="contact-card" style={styles.contactCard}>
                        <h3>Park Services</h3>
                        <p style={styles.phone}>Phone: <a href="tel:832-982-8274" style={styles.link}>832-982-8274</a></p>
                        <p>Email: <a href="mailto:Coogworld_service@uh.edu" style={styles.link}>Coogworld_service@uh.edu</a></p>
                    </div>
                    
                    <div className="contact-card" style={styles.contactCard}>
                        <h3>Business Inquiries</h3>
                        <p style={styles.phone}>Phone: <a href="tel:832-910-2953" style={styles.link}>832-910-2953</a></p>
                        <p>Email: <a href="mailto:Coogworld_business@uh.edu" style={styles.link}>Coogworld_business@uh.edu</a></p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AboutUs;
