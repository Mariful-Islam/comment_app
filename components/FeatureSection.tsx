import React from "react";
import { 
  Zap, 
  MessageCircle, 
  BarChart3, 
  Calendar, 
  ShieldCheck, 
  Users 
} from "lucide-react";
import { Button } from "./ui/button";

const features = [
  {
    title: "Instant Auto-Reply",
    description: "Never keep a customer waiting. Our AI handles FAQs and price queries instantly on Facebook & Instagram.",
    icon: <Zap className="w-6 h-6 text-orange-500" />,
    color: "bg-orange-500/10",
  },
  {
    title: "Unified Inbox",
    description: "Manage all your comments and messages from one dashboard. No more switching between apps.",
    icon: <MessageCircle className="w-6 h-6 text-blue-500" />,
    color: "bg-blue-500/10",
  },
  {
    title: "Smart Analytics",
    description: "Track which posts are driving sales. Get detailed insights into customer behavior and growth.",
    icon: <BarChart3 className="w-6 h-6 text-emerald-500" />,
    color: "bg-emerald-500/10",
  },
  {
    title: "Bulk Scheduling",
    description: "Plan your content weeks in advance. Schedule posts for both platforms with a single click.",
    icon: <Calendar className="w-6 h-6 text-purple-500" />,
    color: "bg-purple-500/10",
  },
  {
    title: "Order Management",
    description: "Convert chats into orders seamlessly. Track payment status and delivery within the chat.",
    icon: <ShieldCheck className="w-6 h-6 text-rose-500" />,
    color: "bg-rose-500/10",
  },
  {
    title: "Team Collaboration",
    description: "Add moderators to your pages without sharing passwords. Assign roles and track performance.",
    icon: <Users className="w-6 h-6 text-amber-500" />,
    color: "bg-amber-500/10",
  },
];

export default function FeatureSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-orange-500 font-bold tracking-widest uppercase text-sm">
            Everything You Need
          </h2>
          <h3 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
            Powerful tools to scale your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Social Commerce</span>
          </h3>
          <p className="text-lg text-slate-600">
            Automate the boring stuff and focus on closing sales. Designed for 
            modern entrepreneurs in Bangladesh.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-3xl border border-slate-100 bg-white hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Bottom Call to Action */}
        <div className="mt-16 text-center">
          <Button variant={`secondary`} className="inline-flex items-center gap-2 p-1 pr-4 rounded-full bg-slate-50 border border-slate-200">
            <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold uppercase">
              Free Trial
            </span>
            <span className="text-sm text-slate-600 font-medium">
              Start your 7-day trial today. No credit card required.
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}