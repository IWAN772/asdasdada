import React, { useState, useEffect, useRef } from 'react';
import Hero from '../components/home/Hero';
import USP from '../components/home/USP';
import FeaturedEvents from '../components/home/FeaturedEvents';
import ServicesPreview from '../components/home/ServicesPreview';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';
import useEntranceAnimation from '@/lib/useEntranceAnimation';

// Storage keys
const EVENTS_STORAGE_KEY = 'ignis_events';
const TESTIMONIALS_STORAGE_KEY = 'ignis_testimonials';
const SERVICES_STORAGE_KEY = 'ignis_services';

// Default data fallbacks
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

const defaultTestimonials = [
  {
    id: '1',
    author: 'Anna i Piotr',
    content: 'Dziękujemy całemu zespołowi Ignis Events za niesamowite wesele! Profesjonalizm, kreatywność i zaangażowanie przeszły nasze oczekiwania. Każdy detal był dopracowany, a my mogliśmy cieszyć się tym wyjątkowym dniem bez stresu.',
    rating: 5,
    event_type: 'Wesele',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    featured: true
  },
  {
    id: '2',
    author: 'Katarzyna Nowak',
    content: 'Firma eventowa na najwyższym poziomie. Organizowaliśmy z nimi galę firmową i wszystko przebiegło perfekcyjnie. Profesjonalna obsługa, świetna komunikacja i niezapomniane wrażenia dla gości.',
    rating: 5,
    event_type: 'Event Firmowy',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    featured: true
  },
  {
    id: '3',
    author: 'Marcin i Tomasz',
    content: 'Najlepsza organizacja imprezy prywatnej jaką mogliśmy sobie wymarzyć. Zespół Ignis Events stworzył niepowtarzalną atmosferę na naszej rocznicy. Polecamy każdemu kto szuka profesjonalistów!',
    rating: 5,
    event_type: 'Impreza Prywatna',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    featured: false
  }
];

const defaultServices = [
  {
    slug: 'wesela',
    name: 'Wesela',
    description: 'Magiczny dzień, który zapamiętacie na zawsze.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80'
  },
  {
    slug: 'eventy_firmowe',
    name: 'Eventy Firmowe',
    description: 'Profesjonalna oprawa Twojego biznesu.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80'
  },
  {
    slug: 'koncerty_gale',
    name: 'Koncerty i Gale',
    description: 'Wielkie wydarzenia, które porywają tłumy.',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=80'
  },
  {
    slug: 'imprezy_prywatne',
    name: 'Imprezy Prywatne',
    description: 'Każda okazja zasługuje na wyjątkową oprawę.',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80'
  }
];

export default function Home() {
  const refContainer = useRef(null);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);
  
  useEntranceAnimation(refContainer);

  // Load all data from localStorage on mount
  useEffect(() => {
    // Load featured events
    try {
      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (storedEvents) {
        const events = JSON.parse(storedEvents);
        setFeaturedEvents(events.filter(e => e.featured).slice(0, 6));
      } else {
        setFeaturedEvents(defaultFeaturedEvents);
      }
    } catch (e) {
      console.error('Error loading events:', e);
      setFeaturedEvents(defaultFeaturedEvents);
    }

    // Load testimonials
    try {
      const storedTestimonials = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
      if (storedTestimonials) {
        const test = JSON.parse(storedTestimonials);
        setTestimonials(test.filter(t => t.featured));
      } else {
        setTestimonials(defaultTestimonials);
      }
    } catch (e) {
      console.error('Error loading testimonials:', e);
      setTestimonials(defaultTestimonials);
    }

    // Load services
    try {
      const storedServices = localStorage.getItem(SERVICES_STORAGE_KEY);
      if (storedServices) {
        setServices(JSON.parse(storedServices));
      } else {
        setServices(defaultServices);
      }
    } catch (e) {
      console.error('Error loading services:', e);
      setServices(defaultServices);
    }
  }, []);

  return (
    <div>
      <Hero />
      <section className="page-container">
        <div ref={refContainer}>
          <div className="stagger-child"><USP /></div>
          <div className="stagger-child"><FeaturedEvents events={featuredEvents} /></div>
          <div className="stagger-child"><ServicesPreview services={services} /></div>
          <div className="stagger-child"><Testimonials testimonials={testimonials} /></div>
          <div className="stagger-child"><CTASection /></div>
        </div>
      </section>
    </div>
  );
}
