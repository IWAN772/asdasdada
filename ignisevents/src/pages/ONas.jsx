import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Calendar, Target, Heart, Star } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import CTASection from '../components/home/CTASection';

const stats = [
  { icon: Calendar, value: '15+', label: 'Lat doświadczenia' },
  { icon: Star, value: '500+', label: 'Zrealizowanych eventów' },
  { icon: Users, value: '50k+', label: 'Zadowolonych gości' },
  { icon: Award, value: '25+', label: 'Nagród branżowych' },
];

const team = [
  {
    name: 'Anna Kowalska',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    description: 'Wizjonerka z 20-letnim doświadczeniem w branży eventowej.'
  },
  {
    name: 'Piotr Nowak',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    description: 'Twórca niepowtarzalnych koncepcji i aranżacji.'
  },
  {
    name: 'Maria Wiśniewska',
    role: 'Event Manager',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    description: 'Perfekcjonistka dbająca o każdy szczegół wydarzenia.'
  },
  {
    name: 'Tomasz Zieliński',
    role: 'Technical Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    description: 'Ekspert od technologii i produkcji eventowej.'
  },
];

const values = [
  {
    icon: Heart,
    title: 'Pasja',
    description: 'Kochamy to, co robimy. Każdy event to dla nas nowa przygoda.'
  },
  {
    icon: Target,
    title: 'Perfekcja',
    description: 'Dbamy o każdy detal, bo wiemy, że sukces tkwi w szczegółach.'
  },
  {
    icon: Users,
    title: 'Partnerstwo',
    description: 'Budujemy długotrwałe relacje oparte na zaufaniu i szacunku.'
  },
];

export default function ONas() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&q=80"
            alt="O Nas"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-500 uppercase tracking-[0.3em] text-sm font-medium mb-4 block"
          >
            Poznaj Nas
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white"
          >
            O Naszej Agencji
          </motion.h1>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-gold-500 uppercase tracking-[0.3em] text-sm font-medium mb-4 block">
                Nasza Historia
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                15 Lat Tworzenia Magicznych Chwil
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  IgnisEvents powstało z pasji do tworzenia niezapomnianych wydarzeń. 
                  Zaczynaliśmy jako mały zespół entuzjastów, a dziś jesteśmy jedną z 
                  wiodących agencji eventowych w Polsce.
                </p>
                <p>
                  Przez lata zrealizowaliśmy setki wesel, gal firmowych, koncertów i 
                  imprez prywatnych. Każde wydarzenie traktujemy jako wyjątkowe wyzwanie 
                  i okazję do stworzenia czegoś niepowtarzalnego.
                </p>
                <p>
                  Nasz sukces opiera się na trzech filarach: pasji, profesjonalizmie 
                  i indywidualnym podejściu do każdego klienta.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"
                  alt="Our Story"
                  className="w-full h-[500px] object-cover"
                />
                  <div className="absolute -bottom-8 -left-8 bg-gradient-to-r from-gold-500 to-amber-400 p-8 text-black">
                  <div className="text-5xl font-bold">15+</div>
                  <div className="text-sm uppercase tracking-wider">Lat doświadczenia</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-gold mx-auto mb-4" />
                <div className="text-4xl md:text-5xl font-bold text-black mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="page-container">
          <SectionTitle
            subtitle="Wartości"
            title="Co Nas Definiuje"
          />

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                  className="text-center p-8 card"
              >
                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-amber-500" />
                </div>
                  <h3 className="text-2xl font-bold text-black mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
          </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="page-container">
          <SectionTitle
            subtitle="Zespół"
            title="Poznaj Naszych Ekspertów"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white">{member.name}</h3>
                      <p className="text-gold">{member.role}</p>
                    </div>
                </div>
                  <p className="text-gray-600 text-sm">{member.description}</p>
              </motion.div>
            ))}
          </div>
          </div>
      </section>

      <CTASection />
    </div>
  );
}