'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [message, setMessage] = useState('Checking server connection...');
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    async function checkServer() {
      try {
        const response = await fetch('http://localhost:8500/api', {
          method: 'GET',
          mode: 'cors',
        });
        if (response.ok) {
          setMessage('Server is connected successfully');
          setStatus('success');
        } else {
          setMessage('Failed to connect to server');
          setStatus('error');
        }
      } catch (error) {
        setMessage('Failed to connect to server');
        setStatus('error');
      }
    }

    checkServer();
  }, []);

  return (
    <div className={styles.container}>
      <p className={`${styles.message} ${styles[status]}`}>{message}</p>
    </div>
  );
}

// 'use client';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react'

// import Createpage from './create/page';

// export default function Home() {

//     const [msg, setMsg] = useState('')

//   useEffect(() => {
//     axios.get('http://localhost:8500/api').then((response) => {
//       console.log(response.data);
//       setMsg(response.data.message || response.data)
//     }).catch((error) => {
//       console.error('Error fetching data:', error);
//       setMsg('Error loading message');
//     });

//   }, [])
//   return (
//     <div>
//       <h1>Hey...! I am Next.js</h1>
//       <h2>Backend message is - {msg}</h2>
//       <Createpage/>
//     </div>
//   )
// }
