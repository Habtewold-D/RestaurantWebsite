"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AboutPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-200">
        <div className="text-2xl font-semibold text-orange-700">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-orange-100 to-yellow-200 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-orange-700 text-center mb-8">
          About Our Restaurant
        </h1>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Story Section */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-orange-200">
            <h2 className="text-3xl font-bold text-orange-700 mb-6 text-center">
              Our Story
            </h2>
            <div className="text-lg text-gray-700 leading-relaxed space-y-4">
              <p>
                Founded in 2010, our restaurant has been serving the community with passion and dedication. 
                What started as a small family-owned establishment has grown into one of the most beloved 
                dining destinations in the area.
              </p>
              <p>
                Our commitment to using fresh, locally-sourced ingredients and traditional cooking methods 
                has remained unchanged throughout the years. Every dish tells a story of tradition, 
                innovation, and love for authentic flavors.
              </p>
              <p>
                We believe that great food brings people together, creating memories that last a lifetime. 
                That's why we pour our heart into every meal we serve.
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-orange-200">
            <h2 className="text-3xl font-bold text-orange-700 mb-6 text-center">
              Our Mission
            </h2>
            <div className="text-center text-lg text-gray-700">
              <p className="mb-4">
                To provide an exceptional dining experience that combines:
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">🌱</div>
                  <h3 className="text-xl font-bold text-orange-700 mb-2">Fresh Ingredients</h3>
                  <p className="text-gray-600">Sourced from local farmers and suppliers</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">👨‍🍳</div>
                  <h3 className="text-xl font-bold text-orange-700 mb-2">Expert Chefs</h3>
                  <p className="text-gray-700">Passionate culinary professionals</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">💝</div>
                  <h3 className="text-xl font-bold text-orange-700 mb-2">Warm Service</h3>
                  <p className="text-gray-600">Making every guest feel at home</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 border border-orange-200">
            <h2 className="text-3xl font-bold text-orange-700 mb-6 text-center">
              Visit Us
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-orange-700 mb-4">Location</h3>
                <div className="space-y-2 text-gray-700">
                  <p>📍 123 Main Street</p>
                  <p>Downtown District</p>
                  <p>City, State 12345</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-700 mb-4">Hours</h3>
                <div className="space-y-2 text-gray-700">
                  <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
                  <p>Saturday: 10:00 AM - 11:00 PM</p>
                  <p>Sunday: 10:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-lg text-gray-700 mb-4">
                For reservations or questions:
              </p>
              <p className="text-xl font-bold text-orange-700">
                📞 (555) 123-4567
              </p>
              <p className="text-lg text-orange-600">
                📧 info@restaurant.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 