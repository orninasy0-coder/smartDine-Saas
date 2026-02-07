import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Owner, The Golden Fork',
    image: '👩‍🍳',
    rating: 5,
    content:
      'SmartDine transformed our restaurant operations. The QR menu system reduced wait times by 40%, and the AI assistant helps customers discover dishes they love. Our revenue increased by 25% in just 3 months!',
  },
  {
    name: 'Michael Chen',
    role: 'Manager, Fusion Bistro',
    image: '👨‍💼',
    rating: 5,
    content:
      'The analytics dashboard gives us insights we never had before. We can track peak hours, popular dishes, and customer preferences in real-time. The AR menu feature is a game-changer for customer engagement.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Owner, Bella Italia',
    image: '👩‍💻',
    rating: 5,
    content:
      'Implementation was seamless, and the support team was fantastic. Our kitchen staff loves the real-time order dashboard, and customers are amazed by the 3D dish visualization. Best investment we made this year!',
  },
  {
    name: 'David Park',
    role: 'Owner, Seoul Kitchen',
    image: '👨‍🍳',
    rating: 5,
    content:
      'The multi-language support is perfect for our diverse customer base. The AI assistant handles customer questions in both English and Arabic flawlessly. Our order accuracy improved significantly.',
  },
  {
    name: 'Lisa Thompson',
    role: 'Manager, Green Leaf Cafe',
    image: '👩‍🌾',
    rating: 5,
    content:
      'SmartDine helped us go completely contactless during the pandemic and we never looked back. The subscription model is affordable, and the features keep getting better with each update.',
  },
  {
    name: 'Ahmed Al-Rashid',
    role: 'Owner, Spice Route',
    image: '👨‍🎨',
    rating: 5,
    content:
      'The delivery management dashboard optimized our delivery routes and reduced delivery times by 30%. Customer satisfaction scores went through the roof. Highly recommend SmartDine!',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by Restaurant Owners
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of successful restaurants that have transformed their operations with SmartDine.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
                {/* Quote Icon Background */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-16 h-16 text-primary" />
                </div>

                <CardContent className="pt-6 relative z-10">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                      {testimonial.image}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">4.9/5 Average Rating</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div>
              <span className="font-semibold">500+ Restaurants</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div>
              <span className="font-semibold">1M+ Orders Processed</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
