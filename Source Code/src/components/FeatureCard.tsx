import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkTo: string;
  linkText: string;
  gradient: string;
  delay?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  linkTo,
  linkText,
  gradient,
  delay = '0s'
}) => {
  return (
    <div 
      className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-echo card-hover animate-slide-up border border-white/50"
      style={{ animationDelay: delay }}
    >
      <div 
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-echo animate-float ${gradient}`}
        style={{ animationDelay: `calc(${delay} + 0.5s)` }}
      >
        <Icon className="h-7 w-7 text-white" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        {description}
      </p>
      
      <Link 
        to={linkTo}
        className="text-blue-600 font-semibold hover:text-blue-700 flex items-center space-x-2 group transition-all-smooth"
      >
        <span>{linkText}</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default FeatureCard;