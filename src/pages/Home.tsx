import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle, FloatingShapes } from '@/components/common';
import { DemoThemeShowcase } from '@/components/DemoThemeShowcase';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-8">
      {/* Floating Shapes Background */}
      <FloatingShapes count={8} />

      {/* Theme Toggle in top-right corner */}
      <div className="fixed top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <motion.h1
        className="relative z-10 text-5xl font-bold text-gray-800 dark:text-white mb-8"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        SmartDine SaaS Platform
      </motion.h1>

      <motion.div
        className="relative z-10 space-y-6 w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Welcome to SmartDine</CardTitle>
            <CardDescription>Your complete restaurant management solution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              React Router is now configured and ready to use!
            </p>
            <p className="text-sm text-muted-foreground">
              Try the theme toggle in the top-right corner to switch between light, dark, and system
              themes.
            </p>
            <Button className="w-full">Get Started</Button>
          </CardContent>
        </Card>

        {/* Theme System Demo */}
        <DemoThemeShowcase />
      </motion.div>
    </div>
  );
}
