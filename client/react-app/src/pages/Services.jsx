import React from 'react';
import strollerImg from '../images/Stroller_icon.jpg';
import wheelchairImg from '../images/Wheelchair_icon.jpg';
import lockerImg from '../images/Locker_icon.jpg';

function Services() {
    const styles = {
        services: {
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
        serviceItem: {
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: '30px',
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '5px',
        },
        icon: {
            width: '100px',
            marginRight: '20px',
        },
        description: {
            flex: 1,
        },
        rate: {
            fontWeight: 'bold',
        },
        freeServices: {
            backgroundColor: '#f0f0f0',
            padding: '15px',
            borderRadius: '5px',
        },
        introParagraph: {
            fontSize: '1.2em',
        },
    };

    return (
        <div className="services" style={styles.services}>
            <h1 style={styles.header}>Our Services</h1>
            
            <section style={styles.introParagraph}>
                <p>
                We offer various in-park services to fit your needs while you visit our park to make your experience as hassle free as possible. 
                These services can be purchased at the service center near the entrance of the park. Below are the services we provide.
                </p>
            </section>
            
            <section style={styles.section}>
                <div style={styles.serviceItem}>
                    <img src={strollerImg} alt="Stroller" style={styles.icon} />
                    <div style={styles.description}>
                        <h2>Strollers</h2>
                        <p style={styles.rate}>One day: $18</p>
                    </div>
                </div>

                <div style={styles.serviceItem}>
                    <img src={wheelchairImg} alt="Wheelchair" style={styles.icon} />
                    <div style={styles.description}>
                        <h2>Wheelchairs</h2>
                        <p style={styles.rate}>One day: $12</p>
                    </div>
                </div>

                <div style={styles.serviceItem}>
                    <img src={lockerImg} alt="Locker" style={styles.icon} />
                    <div style={styles.description}>
                        <h2>Lockers</h2>
                        <p style={styles.rate}>One day: $12, Bi-hourly Rate: $2</p>
                        <p>Size: 12" x 13" x 16.9"</p>
                        <p><strong>Notice:</strong> Unclaimed items that remain inside a locker past park closing time will be stored at the service center front desk.</p>
                    </div>
                </div>
            </section>

            <section style={styles.freeServices}>
                <h2>Free Services</h2>
                <p style={styles.introParagraph}>These services are at no extra cost:</p>
                <ul style={styles.introParagraph}>
                    <li>First Aid</li>
                    <li>Wi-Fi Access</li>
                </ul>
            </section>
        </div>
    );
}

export default Services;
