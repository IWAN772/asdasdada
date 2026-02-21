import React, { useState, useEffect, useRef } from 'react';
import Hero from '../components/home/Hero';
import USP from '../components/home/USP';
import FeaturedEvents from '../components/home/FeaturedEvents';
import ServicesPreview from '../components/home/ServicesPreview';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';
import useEntranceAnimation from '@/lib/useEntranceAnimation';

const STORAGE_KEY = 'ignis_events';

// Default featured events fallback
const defaultFeaturedEvents = [
  {
    id: '1',
    title: 'Bajkowe Wesele w Pałacu',
    category: 'wesela',
    location: 'Pałac w Jabłonnie',
    date: '2024-06-15',
    guests_count: 150,
    short_description: 'Romantyczne wesele w zabytkowym pałacu z przepięknym ogrodem.',
    main_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80'
    ],
    featured: true
  },
  {
    id: '2',
    title: 'Gala Rocznicowa TechCorp',
    category: 'eventy_firmowe',
    location: 'Hotel Marriott Warszawa',
    date: '2024-05-20',
    guests_count: 300,
    short_description: 'Elegancka gala z okazji 25-lecia firmy z programem artystycznym.',
    main_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80'
    ],
    featured: true
  },
];

// Load featured events from localStorage
const loadFeaturedEvents = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const events = JSON.parse(stored);
      return events.filter(e => e.featured).slice(0, 6);
    }
  } catch (e) {
    console.error('Error loading featured events:', e);
  }
  return defaultFeaturedEvents;
};

export default function Home() {
  const refContainer = useRef(null);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  
  useEntranceAnimation(refContainer);

  // Load featured events on mount
  useEffect(() => {
    const events = loadFeaturedEvents();
    setFeaturedEvents(events);
  }, []);

  return (
    <div>
      <Hero />
      <section className="page-container">
        <div ref={refContainer}>
          <div className="stagger-child"><USP /></div>
          <div className="stagger-child"><FeaturedEvents events={featuredEvents} /></div>
          <div className="stagger-child"><ServicesPreview /></div>
          <div className="stagger-child"><Testimonials testimonials={testimonials} /></div>
          <div className="stagger-child"><CTASection /></div>
        </div>
      </section>
    </div>
  );
}
