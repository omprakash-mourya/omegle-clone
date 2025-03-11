'use client';

import { Button } from "@nextui-org/react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Video, Users, Shield } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();

  const features = [
    {
      icon: <Video className="h-8 w-8 text-blue-600" />,
      title: "HD Video Chat",
      description: "Crystal clear video quality for the best chat experience",
      color: "bg-blue-50 border-blue-200",
      iconBg: "bg-blue-100"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Global Community",
      description: "Connect with people from all around the world",
      color: "bg-purple-50 border-purple-200",
      iconBg: "bg-purple-100"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Secure & Private",
      description: "Your safety and privacy are our top priority",
      color: "bg-green-50 border-green-200",
      iconBg: "bg-green-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 text-center"
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100 blur-3xl opacity-30" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-100 blur-3xl opacity-30" />
        </div>

        <div className="relative space-y-8 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Random Video Chat
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto"
          >
            Meet new people through random video chat. Connect instantly with
            strangers from around the world.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="pt-8"
          >
            {session ? (
              <Link href={{ pathname: '/chat' } as any}>
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-blue-500/20 transform hover:scale-105 transition-all duration-200"
                >
                  Start Video Chat
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-blue-500/20 transform hover:scale-105 transition-all duration-200"
                onPress={() => signIn("google")}
              >
                Sign in with Google
              </Button>
            )}
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="relative w-full max-w-2xl mx-auto mt-12 p-6 bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/50"
          >
            <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 p-8 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                <div className="bg-white rounded-lg shadow-lg p-4 aspect-square flex items-center justify-center">
                  <Users className="w-12 h-12 text-blue-600" />
                </div>
                <div className="bg-white rounded-lg shadow-lg p-4 aspect-square flex items-center justify-center">
                  <Video className="w-12 h-12 text-purple-600" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
              className={`${feature.color} border-2 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 ${feature.iconBg} rounded-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="bg-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-blue-600">1M+</h3>
              <p className="text-gray-600 mt-2">Active Users</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-purple-600">50K+</h3>
              <p className="text-gray-600 mt-2">Daily Chats</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-green-600">190+</h3>
              <p className="text-gray-600 mt-2">Countries</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="text-center py-8 text-sm text-gray-600 bg-gray-50"
      >
        <p>By using this service, you agree to our Terms of Service & Privacy Policy.</p>
      </motion.div>
    </div>
  );
} 