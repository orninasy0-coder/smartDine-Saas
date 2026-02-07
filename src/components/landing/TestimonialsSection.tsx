import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ChefHat, Clock, TrendingUp, Users, Sparkles, CheckCircle2 } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Real-Time Order Management',
    titleAr: 'إدارة الطلبات الفورية',
    description: 'Instant notifications and live order tracking keep your kitchen running smoothly',
    descriptionAr: 'إشعارات فورية وتتبع مباشر للطلبات لإبقاء مطبخك يعمل بسلاسة',
  },
  {
    icon: TrendingUp,
    title: 'Smart Analytics',
    titleAr: 'تحليلات ذكية',
    description: 'Data-driven insights to optimize your menu and boost revenue',
    descriptionAr: 'رؤى مدعومة بالبيانات لتحسين قائمتك وزيادة الإيرادات',
  },
  {
    icon: Users,
    title: 'Team Coordination',
    titleAr: 'تنسيق الفريق',
    description: 'Seamless communication between kitchen, delivery, and management',
    descriptionAr: 'تواصل سلس بين المطبخ والتوصيل والإدارة',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Assistance',
    titleAr: 'مساعدة بالذكاء الاصطناعي',
    description: 'Smart recommendations and automated workflows save time',
    descriptionAr: 'توصيات ذكية وسير عمل آلي يوفر الوقت',
  },
];

const benefits = [
  'Reduce order processing time by 60%',
  'Increase kitchen efficiency',
  'Minimize errors and waste',
  'Scale operations effortlessly',
];

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <ChefHat className="w-4 h-4" />
              <span className="text-sm font-semibold">Smart Kitchen Technology</span>
            </motion.div>

            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Restaurant's
              <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Smart Kitchen Partner
              </span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Transform your kitchen operations with intelligent automation, real-time insights, and seamless team coordination. SmartDine empowers your staff to focus on what matters most - creating amazing food.
            </p>

            {/* Benefits List */}
            <div className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <feature.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Floating Chef Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex items-center justify-center"
          >
            {/* Floating Animation Container */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl scale-150" />

              {/* Chef Image Container */}
              <div className="relative z-10">
                {/* Placeholder for Chef Image - Replace with actual image */}
                <div className="w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] relative">
                  {/* Chef Image - Behind the circle (z-0) with circular clipping and glass morphism */}
                  <div className="absolute inset-0 flex items-center justify-center z-0 rounded-full overflow-hidden bg-background/60 backdrop-blur-sm border border-border/30">
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Chef Image */}
                      <img
                        src="/images/CHEF.png"
                        alt="Smart Kitchen Chef"
                        className="w-full h-full object-cover drop-shadow-2xl scale-110"
                        onError={(e) => {
                          // Fallback to emoji if image fails to load
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) {
                            fallback.classList.remove('hidden');
                            fallback.classList.add('flex');
                          }
                        }}
                      />
                      {/* Fallback emoji (shown if image not found) */}
                      <div className="hidden w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 items-center justify-center text-8xl">
                        👨‍🍳
                      </div>
                    </div>
                  </div>

                  {/* Decorative Circle Background - On top of image (z-10) */}
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute inset-0 rounded-full border-4 border-dashed border-primary/20 z-10"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '500+', label: 'Active Restaurants' },
            { value: '60%', label: 'Faster Processing' },
            { value: '1M+', label: 'Orders Managed' },
            { value: '24/7', label: 'Support Available' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
