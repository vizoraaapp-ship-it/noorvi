'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        title: "Wholesale Cosmetics at the Best Prices",
        subtitle: "Luxury Essentials for Professionals",
        description: "All Your Beauty Essentials in One Place. Top-tier luxury for professional salons and retail partners.",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087&auto=format&fit=crop",
        ctaPrimary: "Shop Now",
        ctaSecondary: "Browse Categories",
        bgColor: "bg-veda-dark"
    },
    {
        title: "Premium Luxury Brands direct to you",
        subtitle: "Authenticity Guaranteed",
        description: "Unlock exclusive wholesale access to international premium brands. Quality you can trust, prices you'll love.",
        image: "https://images.unsplash.com/photo-1596462502278-27bfbef4f0f1?q=80&w=2080&auto=format&fit=crop",
        ctaPrimary: "Explore Brands",
        ctaSecondary: "New Arrivals",
        bgColor: "bg-veda-dark"
    },
    {
        title: "Fast Global Dispatch & Bulk Loyalty",
        subtitle: "Business Ready Shipping",
        description: "Priority shipping within 24 hours for all professional orders. Scale your business with our dedicated support.",
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop",
        ctaPrimary: "Learn More",
        ctaSecondary: "Apply for Wholesale",
        bgColor: "bg-veda-dark"
    }
];

const HeroBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 3000); // 3 seconds

        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <div className="relative h-[500px] md:h-screen w-full overflow-hidden group">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        } ${slide.bgColor}`}
                >
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-black/30 z-10" />

                    {/* Immersive bottom fade to page background (#FDDDE6) */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#FDDDE6] via-[#FDDDE6]/60 to-transparent z-20 pointer-events-none" />

                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="relative z-30 flex flex-col justify-center items-center h-full px-8 md:px-16 text-center text-white">
                        <p className="text-veda-gold font-bold tracking-[0.3em] uppercase mb-4 animate-fade-in-up">
                            {slide.subtitle}
                        </p>
                        <h1 className="text-5xl md:text-8xl font-serif mb-6 leading-tight max-w-5xl animate-fade-in-up delay-100">
                            {slide.title.split('Best Prices')[0]}
                            {slide.title.includes('Best Prices') && (
                                <span className="text-veda-accent italic">Best Prices</span>
                            )}
                        </h1>
                        <p className="text-lg md:text-2xl mb-10 text-white/90 max-w-2xl leading-relaxed animate-fade-in-up delay-200 font-light">
                            {slide.description}
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 animate-fade-in-up delay-300">
                            <Link
                                href="/search"
                                className="px-12 py-4 bg-veda-gold hover:bg-white hover:text-veda-dark text-white font-bold rounded-full transition-all duration-500 shadow-2xl active:scale-95 text-lg"
                            >
                                {slide.ctaPrimary}
                            </Link>
                            <Link
                                href="#categories"
                                className="px-12 py-4 bg-white/10 backdrop-blur-xl border border-white/30 hover:bg-white/30 text-white font-bold rounded-full transition-all duration-500 active:scale-95 text-lg"
                            >
                                {slide.ctaSecondary}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/40"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/40"
            >
                <ChevronRight size={24} />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 transition-all duration-500 rounded-full ${index === currentSlide ? 'w-10 bg-veda-gold' : 'w-2 bg-white/50 hover:bg-white'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroBanner;
