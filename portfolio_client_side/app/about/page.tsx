import React from 'react';
import Link from 'next/link';
import { ArrowRight, Music, BookOpen, Code, Lightbulb, Users, Instagram, Linkedin } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden ring-4 ring-blue-200 dark:ring-blue-800">
            {/* Replace with your actual profile photo */}
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
              TN
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Hey, I&apos;m Tonny Blair Nyauke
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Founder of Zuriscale • Fullstack JavaScript Engineer • Self-Taught Developer
          </p>
          
          <div className="text-lg text-gray-500 dark:text-gray-400">
            📍 Homa Bay Town, Kenya
          </div>
        </div>

        {/* Main Story */}
        <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 mb-16">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Lightbulb className="mr-3 text-yellow-500" />
              How It All Started
            </h2>
            
            <p className="mb-6 text-base leading-relaxed">
              Picture this: 2022, I was an electrical engineering student at Moi University doing my industrial attachment. 
              I&apos;m broke, no phone, no money – basically living that authentic broke student life. But instead of wallowing, 
              I had this wild idea: &quot;I&apos;m an engineering student, why can&apos;t I just build my own smartphone?&quot;
            </p>
            
            <p className="mb-6 text-base leading-relaxed">
              So I dove deep into research, only to realize I'd need massive capital (reality check! 😅). 
              But that research rabbit hole led me to business YouTube channels, and boom – my entrepreneurship journey began. 
              Sometimes the best discoveries happen when your original plan falls apart.
            </p>
            
            <p className="text-base leading-relaxed">
              December 2022 was my turning point. I got my hands on a laptop and started coding with Java Android development. 
              By October 2023, I pivoted to web development with React, then moved to Next.js in May 2024. 
              Eventually, I made the bold decision to drop out of electrical engineering to fully commit to software development. 
              Best decision I ever made – each day coding taught me more than I could have imagined.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Users className="mr-3 text-blue-500" />
              The &quot;Aha!&quot; Moment
            </h2>
            
            <p className="mb-6 text-base leading-relaxed">
              Around 2023, something clicked. I realized I had accumulated knowledge that many Kenyan business owners didn&apos;t have. 
              The question became: how could I package this knowledge into something that actually helps people?
            </p>
            
            <p className="mb-6 text-base leading-relaxed">
              I went through tons of ideas, built different projects, refined concepts, and eventually narrowed down to something specific: 
              software for boutique owners. That's how <strong className="text-blue-600 dark:text-blue-400">Zuriscale</strong> was born.
            </p>
            
            <p className="text-base leading-relaxed">
              With Zuriscale, I help boutique owners turn one-time customers into repeat customers through automated WhatsApp follow-ups, 
              targeted campaigns, and conversion-focused conversations. We don't have paying customers yet, but seeing people get curious, 
              click our links, and join our WhatsApp group? That's pure motivation fuel right there.
            </p>
          </div>
        </div>

        {/* What Drives Me */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Code className="mr-3 text-green-500" />
            What Actually Drives Me
          </h2>
          
          <p className="mb-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
            Here&apos;s the thing that gets me up every morning: <strong>I can literally build something that helps people with the skills I have</strong>. 
            That realization is both humbling and incredibly energizing.
          </p>
          
          <p className="mb-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
            I operate with what I call a &quot;maniacal sense of urgency&quot; – if something can be done today, why wait until tomorrow? 
            I&apos;m admittedly a bit of a workaholic, but I balance it out with dry jokes that somehow people find funny 😄
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">What I&apos;m Building With</h3>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Prompt Engineering'].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">When I'm Not Coding</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>Reading books</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Music className="w-4 h-4 mr-2" />
                  <span>Training church choir & singing</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Music className="w-4 h-4 mr-2" />
                  <span>Learning piano (recent adventure!)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Focus */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            What I&apos;m Up To These Days
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🚀 Building Zuriscale</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Refining both the software and business model to help boutique owners retain customers and grow their businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">💻 Freelance Development</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Started freelancing as a fullstack JavaScript engineer this year. Always excited about new projects and challenges.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🎯 Self-Taught Journey</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Dropped out of electrical engineering to pursue software development full-time. Learning by building, failing, and building again.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">📚 Always Learning</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Currently exploring new technologies and business strategies. Love learning new things that can make an impact.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">
            Let&apos;s Connect!
          </h2>
          <p className="text-blue-100 mb-6 leading-relaxed">
            I love connecting with fellow entrepreneurs, developers, and anyone with interesting ideas. 
            Drop me a line on social media – I promise my dry jokes are better in person! 😄
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link 
              href="https://www.instagram.com/nyauke_industries/" target='_blank'
              className="flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              <Instagram className="w-5 h-5 mr-2" />
              Instagram
            </Link>
            <Link 
              href="www.linkedin.com/in/tonnynyauke" target='_blank'
              className="flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              <Linkedin className="w-5 h-5 mr-2" />
              LinkedIn
            </Link>
          </div>
          
          <div className="mt-6">
            <Link 
              href="/projects" 
              className="inline-flex items-center text-blue-100 hover:text-white transition-colors duration-200"
            >
              Check out my projects
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;