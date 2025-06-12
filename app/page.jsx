"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import NavBar from "@/components/navbar";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { Particles } from "@/components/magicui/particles";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";


export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      <SmoothCursor />
      <Particles className="absolute inset-0 z-0 opacity-60" />
      <NavBar />
      <ScrollProgress className="top-[65px] z-10" />

      {/* Hero Section */}
      <section className="text-center py-32 px-5 relative z-10 bg-gradient-to-b from-white via-[#fdf2f8] to-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent"
        >
          <TypingAnimation className="text-6xl" >Revolutionize Learning With</TypingAnimation>
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent"
        >
          <TypingAnimation className="text-6xl" delay={3000}>AI Powered Voice Agent</TypingAnimation>
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
          <Button asChild className="text-lg px-6 py-3">
            <Link 
              href={ isLoaded && isSignedIn ? "/dashboard" : "/sign-up"} 
              >{isLoaded && isSignedIn ? "Go to Dashboard" : "Get Started"}
            </Link>
          </Button>
          
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-20"
        >
          <Image
            src="/hero-banner.png"
            alt="AI Coach Illustration"
            width={1000}
            height={700}
            className="mx-auto rounded-2xl shadow-2xl transition-transform hover:scale-[1.02]"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-28 px-5">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-14 text-gray-800"
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
      {/* <section className="py-28 px-5 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-14">How It Works</h2>
        <ol className="space-y-6 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
          <li>1. Sign up and set your coaching goals.</li>
          <li>2. Hit the mic button and start talking.</li>
          <li>3. Get instant AI-powered responses and follow-ups.</li>
          <li>4. Track progress and improve session by session.</li>
        </ol>
      </section> */}

      {/* Testimonials */}
      <section className="bg-gray-50 py-28 px-5 text-center">
        <h2 className="text-4xl font-bold mb-14">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <TestimonialCard
            name="Priya S."
            text="I’ve never stayed so consistent with learning. This voice coach keeps me motivated every day!"
          />
          <TestimonialCard
            name="James L."
            text="It’s like having a personal mentor 24/7. I just talk and it guides me smartly."
          />
          <TestimonialCard
            name="Aisha R."
            text="The AI actually understands what I need and tailors feedback. Game changer."
          />
        </div>
      </section>

      {/* Final CTA */}
      <footer className="bg-black text-white text-center py-24 px-5">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-8"
        >
          Ready to Transform Your Mindset?
        </motion.h2>
        <Button asChild className="text-lg px-6 py-3">
            <Link 
              href={ isLoaded && isSignedIn ? "/dashboard" : "/sign-up"} 
              >{isLoaded && isSignedIn ? "Go to Dashboard" : "Get Started"}
            </Link>
          </Button>
        <p className="mt-8 text-sm text-gray-400">© {new Date().getFullYear()} AI Coach Inc.</p>
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
      className="bg-white rounded-3xl p-8 shadow-xl text-left flex flex-col items-start gap-4 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <Image src={icon} alt={title} width={48} height={48} className="mb-2" />
      <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600 text-base leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function TestimonialCard({ name, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl p-6 shadow-lg text-left hover:shadow-2xl transition-all duration-300"
    >
      <p className="text-gray-700 text-base mb-4">“{text}”</p>
      <p className="text-sm font-semibold text-gray-900">— {name}</p>
    </motion.div>
  );
}
