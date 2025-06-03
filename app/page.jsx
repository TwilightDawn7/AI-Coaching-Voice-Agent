"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import NavBar from "@/components/navbar";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { Particles } from "@/components/magicui/particles";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <NavBar />
      <ScrollProgress className="top-[65px]"/>
      {/* Hero Section */}
      <section className="text-center py-20 px-5">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent"
        >
          <TypingAnimation className='text-6xl'>Revolutionize Learning With</TypingAnimation>
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent"
        >
          AI Powered Voice Agent
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Talk to a personalized AI coach in real-time. Improve skills, gain insights, and stay motivated — just by speaking.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8 flex justify-center gap-4"
        >
          <Button className="text-lg px-6 py-3">Start Coaching</Button>
          <Button variant="outline" className="text-lg px-6 py-3">Learn More</Button>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-10"
        >
          <Image
            src="/hero-voice.svg"
            alt="AI Coach Illustration"
            width={500}
            height={300}
            className="mx-auto"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-20 px-5">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-10"
          >
            What Makes It Powerful
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              title="Real-time Voice Interaction"
              desc="Speak naturally. Our system listens, understands, and responds instantly like a human coach."
              icon="/mic-fill.svg"
            />
            <FeatureCard
              title="Expert-Level Guidance"
              desc="Built on top of expert coaching frameworks tailored for growth, learning, or therapy."
              icon="/brain.svg"
            />
            <FeatureCard
              title="Private & Secure"
              desc="End-to-end encryption and secure voice processing. Your growth is your business only."
              icon="/shield-fill.svg"
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-5 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <ol className="space-y-6 text-lg">
          <li>1. Sign up and set your coaching goals.</li>
          <li>2. Hit the mic button and start talking.</li>
          <li>3. Get instant AI-powered responses and follow-ups.</li>
          <li>4. Track progress and improve session by session.</li>
        </ol>
      </section>

      {/* Testimonials - Placeholder */}
      <section className="bg-gray-50 py-20 px-5 text-center">
        <h2 className="text-3xl font-bold mb-6">What Our Users Say</h2>
        <p className="text-gray-500">⭐ Testimonials coming soon</p>
      </section>

      {/* Final CTA */}
      <footer className="bg-black text-white text-center py-16">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-4"
        >
          Ready to Transform Your Mindset?
        </motion.h2>
        <Button className="text-lg px-6 py-3">Get Started</Button>
        <p className="mt-4 text-sm text-gray-400">© {new Date().getFullYear()} AI Coach Inc.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-6 shadow-md text-left flex flex-col items-start gap-4"
    >
      <Image src={icon} alt={title} width={40} height={40} />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </motion.div>
  );
}
