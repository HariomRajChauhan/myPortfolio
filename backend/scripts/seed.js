import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project.js';
import Certificate from '../models/Certificate.js';
import Resume from '../models/Resume.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Project.deleteMany({});
    await Certificate.deleteMany({});
    await Resume.deleteMany({});

    console.log('Cleared existing data');

    // Seed Projects
    const projects = [
      {
        title: 'Smart Multi-Crop Disease Detection and Yield Prediction',
        description: 'AI-powered system using CNN for disease detection and LSTM for yield prediction. Developed as a 4-member team for Software Engineering minor project (ENCT 352).',
        objective: 'Help farmers identify crop diseases early and predict yields using deep learning.',
        techStack: ['Python', 'TensorFlow', 'CNN', 'LSTM', 'OpenCV', 'Flask'],
        githubUrl: null,
        liveUrl: null,
        imageUrl: '/placeholder-project.png',
        featured: true,
        order: 1
      },
      {
        title: 'TCP-Based Web Server (WEB_server)',
        description: 'Framework-free HTTP server built in C++17 with socket and server abstraction layers. Implements HTTP/1.1 protocol from scratch.',
        objective: 'Deep understanding of networking, sockets, and HTTP protocol implementation.',
        techStack: ['C++17', 'Socket Programming', 'TCP/IP', 'HTTP/1.1', 'Linux'],
        githubUrl: 'https://github.com/HariomRajChauhan/WEB_server',
        liveUrl: null,
        imageUrl: '/placeholder-project.png',
        featured: true,
        order: 2
      },
      {
        title: 'Feelings - React Native App',
        description: 'Mobile application for mood tracking and emotional wellbeing built with React Native.',
        objective: 'Create an intuitive mobile experience for mental health awareness.',
        techStack: ['React Native', 'JavaScript', 'Firebase', 'Redux'],
        githubUrl: null,
        liveUrl: null,
        imageUrl: '/placeholder-project.png',
        featured: true,
        order: 3
      },
      {
        title: 'Exe_Cleaner',
        description: 'Utility tool for cleaning executable files and optimizing system performance.',
        objective: 'Automate system cleanup tasks efficiently.',
        techStack: ['C++', 'Windows API', 'System Programming'],
        githubUrl: null,
        liveUrl: null,
        imageUrl: '/placeholder-project.png',
        featured: false,
        order: 4
      },
      {
        title: 'Personal Portfolio (hariomchauhan.com.np)',
        description: 'Full-stack MERN portfolio with JWT-authenticated admin panel, deployed on Netlify and Render.',
        objective: 'Showcase projects and skills with a professional online presence.',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'TailwindCSS'],
        githubUrl: 'https://github.com/HariomRajChauhan',
        liveUrl: 'https://hariomchauhan.com.np',
        imageUrl: '/placeholder-project.png',
        featured: true,
        order: 0
      }
    ];

    await Project.insertMany(projects);
    console.log('✓ Projects seeded');

    // Seed Certificates
    const certificates = [
      {
        title: 'Full Stack Web Development',
        issuer: 'freeCodeCamp',
        date: new Date('2024-01-15'),
        credentialUrl: null,
        imageUrl: '/placeholder-certificate.png'
      },
      {
        title: 'Machine Learning Specialization',
        issuer: 'Coursera - Stanford University',
        date: new Date('2023-11-20'),
        credentialUrl: null,
        imageUrl: '/placeholder-certificate.png'
      },
      {
        title: 'UI/UX Design Fundamentals',
        issuer: 'Google Career Certificates',
        date: new Date('2023-08-10'),
        credentialUrl: null,
        imageUrl: '/placeholder-certificate.png'
      }
    ];

    await Certificate.insertMany(certificates);
    console.log('✓ Certificates seeded');

    // Seed Resume placeholder
    const resume = {
      fileName: 'Hariom_Chauhan_Resume.pdf',
      filePath: '/resumes/Hariom_Chauhan_Resume.pdf',
      downloadCount: 0
    };

    await Resume.create(resume);
    console.log('✓ Resume seeded');

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
