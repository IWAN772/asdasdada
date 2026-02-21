import React, { useState, useEffect, useRef } from 'react';
import Hero from '../components/home/Hero';
import USP from '../components/home/USP';
import FeaturedEvents from '../components/home/FeaturedEvents';
import ServicesPreview from '../components/home/ServicesPreview';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';
import useEntranceAnimation from '@/lib/useEntranceAnimation';

// Default data fallbacks - always show these first
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
  const [featuredEvents, setFeaturedEvents] = useState(defaultFeaturedEvents);
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [services, setServices] = useState(defaultServices);
  const [isLoading, setIsLoading] = useState(false);
  
  useEntranceAnimation(refContainer);

  // Try to load from Base44, but fall back to defaults on error
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Try to import base44 dynamically
      try {
        const { base44 } = await import('@/api/base44Client');
        
        // Try fetching events
        try {
          const eventsResponse = await base44.entities.Event.list();
          const events = eventsResponse?.data || eventsResponse || [];
          const featuredEventsData = events.filter(e => e.featured).slice(0, 6);
          if (featuredEventsData.length > 0) {
            setFeaturedEvents(featuredEventsData);
          }
        } catch (e) {
          console.log('Using default events (Base44 unavailable)');
        }

        // Try fetching testimonials
        try {
          const testimonialsResponse = await base44.entities.Testimonial.list();
          const testData = testimonialsResponse?.data || testimonialsResponse || [];
          const featuredTestimonials = testData.filter(t => t.featured);
          if (featuredTestimonials.length > 0) {
            setTestimonials(featuredTestimonials);
          }
        } catch (e) {
          console.log('Using default testimonials (Base44 unavailable)');
        }

        // Try fetching services
        try {
          const servicesResponse = await base44.entities.Service.list();
          const servicesData = servicesResponse?.data || servicesResponse || [];
          if (servicesData.length > 0) {
            setServices(servicesData);
          }
        } catch (e) {
          console.log('Using default services (Base44 unavailable)');
        }
      } catch (e) {
        console.log('Base44 client unavailable, using default data');
      }
      
      setIsLoading(false);
    };

    // Small delay to ensure page loads first
    const timer = setTimeout(fetchData, 100);
    return () => clearTimeout(timer);
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
